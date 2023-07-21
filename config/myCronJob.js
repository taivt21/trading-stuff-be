import Auctions from "../entities/auction.js";
import Transactions from "../entities/transaction.js";

export const updateAuctionsAndTransactions = async () => {
  try {
    console.log("Đang chạy cron job...");

    // Get expired auctions
    const currentDate = new Date();
    const oneDayAgo = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    const expiredAuctions = await Auctions.find({
      createdAt: { $lt: oneDayAgo },
      status: "ongoing",
    });
    console.log(expiredAuctions);

    // updates all transactions status "ongoing"
    const bulkUpdates = expiredAuctions.map((auction) => ({
      updateOne: {
        filter: { post: auction.postId },
        update: { $set: { userId: auction.bidders[0]?.user } }, // Optional
        upsert: true,
      },
    }));

    const bulkWriteResult = await Transactions.bulkWrite(bulkUpdates);
    console.log(bulkWriteResult);

    // Update status to "done"
    const updateAuctionsPromises = expiredAuctions.map((auction) =>
      Auctions.findByIdAndUpdate(auction._id, { status: "done" })
    );

    await Promise.all(updateAuctionsPromises);

    //Update transactions highest bidder
    const updateTransactionsPromises = expiredAuctions.map((auction) =>
      Transactions.findOneAndUpdate(
        { post: auction.postId },
        { userId: auction.bidders[0]?.user }, // Optional
        { upsert: true }
      )
    );

    const transactionsResults = await Promise.all(updateTransactionsPromises);
    console.log(transactionsResults);

    console.log("Đã cập nhật trạng thái và transaction thành công");
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái và transaction:", error);
  }
};
