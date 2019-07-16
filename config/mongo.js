if(process.env.NODE_ENV==='production'){
    module.exports={mongoURI:process.env.productionURI};
}
else{
    module.exports={mongoURI:process.env.devURI};
}
