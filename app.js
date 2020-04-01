var express    = require("express"),
	methodOverride = require("method-override"), // for allowing to listen put request on server
	                                             // side 9 html doesnt allow anything else except get/post.
	expressSanitizer = require("express-sanitizer"),
    app        = express(),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose");

//mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect("mongodb+srv://godxpunk:NEphilem12@cluster0-zxnej.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

mongoose.set('useUnifiedTopology', true);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
mongoose.set('useFindAndModify', false);

app.set("view engine","ejs");

//Schema Setup
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog= mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "image url",
// 	body: " Here's a test blog for you!"
// });

//Restful Routes
app.get("/",(req,res)=>{
	res.redirect("/blogs");
});

app.get("/blogs",(req,res)=>{
	Blog.find({},function(err, blogs){
		if(err){
			console.log("error");
		}
		else{
			res.render("index",{blogs: blogs});
		}
	});
});

//new route
app.get("/blogs/new",(req,res)=>{
	res.render("new");
})

//create route
app.post("/blogs",(req,res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,(err,newBlog)=>{
		if(err){
			res.render("new");
		}
		else {
			res.redirect("/blogs");
		}
	});
});

//Show Route
app.get("/blogs/:id",(req,res)=>{
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog: foundBlog});
		}
	});
});

//Edit Route
app.get("/blogs/:id/edit",(req,res)=>{
	//req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog: foundBlog});
		}
	});
	//res.render("edit");
})

//Update Route
app.put("/blogs/:id",(req,res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//Delete route
app.delete("/blogs/:id",(req,res)=>{
	//destroy blog
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});






app.listen(3000,function(){
	console.log("Restful server is running");
});