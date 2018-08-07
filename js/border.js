$(window).resize(function () {
	console.log($(".sep0").width());
	var w = $(".sep0").width();
	for(var i = 1 ; i < 8; i++){
		if(i % 2 == 0){
			$(".sep"+i).height(w);
		}else{
			$(".sep"+i).width(w);
		}
	}
});