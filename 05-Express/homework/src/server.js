// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

const PATH = '/posts';
let id = 1;

// TODO: your code to handle requests
server.post(PATH, (req, res) => {
    const {author, title, contents} = req.body;
    if (!author || !title || !contents) {
       return res
        .status(STATUS_USER_ERROR)
        .json({error: "No se recibieron los parámetros necesarios para crear el Post"})
    } 
    //Si los tres campos fueron provistos, crear un nuevo objeto Post con los valores indicados para `author`, `title` y `contents` y asignándole un valor numérico único como propiedad `id`. Agregar dicho objeto al array de posts. Devolver un JSON con el objeto recientemente creado.
    const post = {
        author, title, contents, id: id++
    }
    posts.push(post);
    res.json(post);
    });
//si vamos a recibir la información por body, necesito el server.use(express.json())para que se transforme la info de modo que el servidor la pueda tomar

server.post(`${PATH}/author/:author`, (req, res) => {
    let {author} = req.params;
    let {title, contents} = req.body;

    if (!author || !title || !contents) {
        return res
         .status(STATUS_USER_ERROR)
         .json({error: "No se recibieron los parámetros necesarios para crear el Post"})
     } 

     const post = {
        author, title, contents, id: id++
    }
    posts.push(post);
    res.json(post);

});

server.get(PATH, (req, res) => {
    //- Si existe el parámetro `term` dentro de la URL (query-string parameter) devolver aquellos Posts que contengan el valor del parámetro `term` en su título o en su contenido (o en ambos).
    //- Caso contrario, devolver todos los Posts que se encuentren almacenados en el array `posts`.
    let {term} = req.query;
    if (term){
        const term_posts = posts.filter((p)=> p.title.includes(term) || p.contents.includes(term));
        return res.json(term_posts);
    }
    res.json(posts);

});

//Cuando se ejecuta el request del tipo `GET` en la ruta `posts/:author`:
//Si existen Post del autor indicado en el parametro `author`, devolverlos.  
//Caso contrario, devolver un JSON con un objeto de la forma `{error: "No existe ningun post del autor indicado"}`. Verificar que el código de error sea el adecuado.

server.get(`${PATH}/:author`, (req, res) => {
    let {author} = req.params;
    const posts_author = posts.filter((p) => p.author === author);
    if (posts_author.length > 0){
    return res.json(posts_author)} 
    else {
        res
        .status(STATUS_USER_ERROR)
        .json({error: "No existe ningun post del autor indicado"})
    }
});

//lo mismo con dos parámetros(punto siguiente del read me)

server.get(`${PATH}/:author/:title`, (req, res) => {
    let {author, title} = req.params;
    const new_posts = posts.filter((p) => p.author === author && p.title === title);
    if (new_posts.length > 0) {
        res.json(new_posts);
    }
    else {
        res
        .status(STATUS_USER_ERROR)
        .json({error: "No existe ningun post con dicho titulo y autor indicado"})  
    }
});

server.put(PATH, (req, res) => {
    /*- Asegurarse que dentro del body del request existan `id`, `title` y `contents`. 
    En el caso de que alguno de ellos no se encuentre, devolver un JSON con un objeto de la forma 
    `{error: "No se recibieron los parámetros necesarios para modificar el Post"}`. 
    Verificar que el código de error sea el adecuado.

    - En el caso de que el `id` no corresponda a un post válido existente, devolver un JSON similar al 
    anterior modificando el mensaje de error por uno adecuado para este caso.

    - Si se encuentran todos los parámetros y el `id` es válido, 
    actualizar los datos del `title` y `contents` del Post que coincida con dicho `id` . 
    Devolver un JSON con el objeto recientemente actualizado. */
    let {id, title, contents} = req.body;
    if (id && title && contents) {
        //find, primer elemento que coincida
        let post = posts.find((p) => p.id === parseInt(id)); //para que si el id llega por string se pueda comparar
        if (post){
            post.title = title;
            post.contents = contents;
            res.json(post);
        } else {
                res.status(STATUS_USER_ERROR)
                .json({error: "No se encuentra el ID necesario"})
        
        }
    } else {
        res.status(STATUS_USER_ERROR)
        .json({error: "No se recibieron los parámetros necesarios para modificar el Post"})
    }
});

server.delete(PATH, (req, res) => {
    let {id} = req.body;
    const post = posts.find((p) => p.id === parseInt(id)); 
    //busco el id
    if(!id || !post){
        res.status(STATUS_USER_ERROR)
        .json({error: "Error"})
    }
    posts = posts.filter((p) => p.id !== parseInt(id));
    //piso posts, quedandome con todos los elementos que no tengan dicho id
    return res.json({success: true});
});

/*Cuando se ejecute un request del tipo `DELETE` en la ruta `author`
Asegurarse que dentro del body del request exista un `author` correspondiente a un autor válido. 
De no ser así, ya sea por falta del campo `author` o por ser un autor inválido, devolver un JSON con un objeto 
con un mensaje correspondiente en cada caso manteniendo la forma de siempre: `{error: "Mensaje de error"}`

En el caso de que el `author` corresponda a un autor válido, eliminar del array de Posts todos los Post 
correspondientes a dicho autor y devolver los posts eliminados.

Nota: Ver que método van a utilizar para eliminar un post, dependiendo el caso puede que sea necesario 
modificar el `const posts = []` del comienzo por `let posts = []` */

server.delete('/author', (req, res) => {
    let {author} = req.body;
    const author_found = posts.find((p) => p.author === author); 
    if (!author || !author_found){
        return res
        .status(STATUS_USER_ERROR)
        .json({error: "No existe el autor indicado"})
    }

    let delete_authors = [];
    posts = posts.filter((p) => 
    {if(p.author !== author) return true;
    else {delete_authors.push(p)}
    });

    return res.json(delete_authors);

});

module.exports = { posts, server };
