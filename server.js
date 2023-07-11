import app from "./app.js";

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  // await connect();
  console.log(`listening on ${port}`);
});
