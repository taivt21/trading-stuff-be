# trading-stuff-be

https://trading-stuff-be-iphg.vercel.app/

## user

-GET user?limit=?&page=?  
-GET user/me  
-PUT user/edit  
-GET user/filter?gte={number}

## post

<<<<<<< HEAD
-GET post/
-POST post/create
-PATCH post/update/:id
-DELETE post/delete/:id
-DELETE post/exchange/
=======
-GET post/  
-POST post/create  
-PATCH post/update/:id  
-DELETE post/delete/:id  
-GET post/statis?gte={number}
>>>>>>> a2218d5f6fe945cb40ec17a3d6c259267c19b853

## comment

-GET comment/  
-POST comment/create  
-PATCH comment/update/:id  
-DELETE comment/delete/:id

## favourite

-GET favorite/  
-GET favorite/me  
-GET favorite/post/:id  
-POST favorite/create  
-DELETE favorite/delete/:id

## auth

-POST auth/login
