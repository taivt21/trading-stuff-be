# trading-stuff-be

https://trading-stuff-be-iphg.vercel.app/

## user

-GET user?limit=?&page=?  
-GET user/me  
-PUT user/edit  
-GET user/filter?gte={number}  
-GET user/me/following  
-GET user/me/followed_by  
-DELETE user/follow/:id  
-GET user/follow/:id
-GET user/info/:id

## post

-GET post/
-POST post/create
-PATCH post/update/:id
-DELETE post/delete/:id
-DELETE post/exchange/
-GET post/statis?gte={number}

## comment

-GET comment/  
-POST comment/create (body: description, postId)
-PATCH comment/update/:id (body: description)
-DELETE comment/delete/:id

## favourite

-GET favorite/  
-GET favorite/me  
-GET favorite/post/:id  
-POST favorite/create (body: postId)
-DELETE favorite/delete/:id

## auth

-POST auth/login

#invoice

-GET invoice/  
-POST invoice/create (body: point, img)
-PATCH invoice/reject/:id
-PATCH invoice/approve/:id
-DELETE invoice/delete/:id

## report

-GET report/  
-POST report/create (body: description, postId)
-DELETE report/delete/:id

## transaction

-GET transaction/me  
-GET transcation/users/:id
