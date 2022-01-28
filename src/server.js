const express = require('express');

const STATUS_USER_ERROR = 422; //dentro del res.status

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

function idUnico() {
  // function closure
  let id = 0;
  return function () {
    id = id + 1;
    return id;
  };
}

const newId = idUnico(); // instancio la closure
// TODO: your code to handle requests CODIGO
server.post('/posts',(req,res)=>{

  const {author, title, contents}= req.body;

  if (author&&title&&contents){
    const newPost = {
      id:newId(),
      author,
      title,
      contents,
    };
    posts.push(newPost);
    return res.json(newPost);
  
  }else{
    return res.status(STATUS_USER_ERROR).json({
      error:'No se recibieron los parámetros necesarios para crear el Post',
    });

  }
    
});
server.get('/posts',(req,res)=>{

  const term= req.query.term;

  if (term){
    const filtered = posts.filter(function(item){
    return (item.title.includes(term))||(item.contents.includes(term))
    });
    return res.json(filtered);
  }else{
    return res.json(posts);
  }
    
});

server.post('/posts/author/:author',(req,res)=>{
  const author = req.params.author;
  const {title, contents}= req.body;
  
  if (author&&title&&contents){
    const newPost = {
      id:newId(),
      author,
      title,
      contents,
    };
    posts.push(newPost);
    return res.json(newPost);
  }else{
    return res.status(STATUS_USER_ERROR).json({
      error:'No se recibieron los parámetros necesarios para crear el Post',
    });

  }});


server.get('/posts/:author',(req,res)=>{
  const authors = req.params.author;
  const postauthor = posts.filter(function(item){
  return item.author===authors});

  if (postauthor.length !==0){
    return res.json(postauthor);
  }else{
    return res.status(STATUS_USER_ERROR).json({
      error:'No se recibieron los parámetros necesarios para crear el Post',
    });

  }});

  server.get('/posts/:author/:title',(req,res)=>{
    const authors = req.params.author;
    const titles = req.params.title;
    const postauthor = posts.filter(function(item){
      return (item.author===authors&&item.title===titles)});
    if (postauthor.length !==0){
      return res.json(postauthor);
    }else{
      return res.status(STATUS_USER_ERROR).json({
        error:'No existe ningun post con dicho titulo y autor indicado',
      });
  
    }});


server.put('/posts',(req,res)=>{
  const {id, title, contents}= req.body;
  if (id&&title&&contents){

    const existe= posts.find(item=>item.id==id);
    if(existe){
      existe.title=title;
      existe.contents=contents;
      return res.json(existe);
    }else{
      return res.status(STATUS_USER_ERROR).json({
        error:'No se recibieron los parámetros necesarios para crear el Post',
      });
    };
  }else{
    return res.status(STATUS_USER_ERROR).json({
      error:'No se recibieron los parámetros necesarios para crear el Post',
    });
  };
  
});
server.delete('/posts', (req, res) => {
  if (req.body.id) {
      const post = posts.find(post => post.id === req.body.id);
      if (post) {
          posts = posts.filter(post => post.id !== req.body.id);
          res.json({ success: true });
      } else {
          return res.status(STATUS_USER_ERROR).json({
              error: "No existe ningun post con dicho titulo y autor indicado"
          });
      }
  } else {
      return res.status(STATUS_USER_ERROR).json({
          error: "Falta el parametro ID"
      });
  }

});
  /*server.delete('/author',(req,res)=>{
    const {author}= req.body;
    const existe= posts.find(item=>item.author ==author);
    if(existe){
      var i = posts.indexOf( existe );
      arr.splice( i, 1 );
      return res.json(posts);
        
      }else{
        return res.status(STATUS_USER_ERROR).json({
          error:'Mensaje de error',
        })};
    });*/

    server.delete('/author', (req, res) => {
      if (req.body.author) {
          const post = posts.find(post => post.author === req.body.author);
          if (post) {
              posts = posts.filter(post => post.author === req.body.author);
              res.json(posts);
          } else {
              return res.status(STATUS_USER_ERROR).json({
                  error: "No existe el autor indicado"
              });
          }
      } else {
          return res.status(STATUS_USER_ERROR).json({
              error: "Mensaje de error"
          });
      }
  
  })



module.exports = { posts, server };
