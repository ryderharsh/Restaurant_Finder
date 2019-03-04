class ZOMATO {
constructor(id) {
	this.api = "b104418ca796de06afc6ffa4c404898e";
	this.url=new URL(window.location.href)
	this.id=parseInt(this.url.searchParams.get("id"))
	this.page=parseInt(this.url.searchParams.get("page"))
	this.header = {
		method:"GET",
		headers: {
			"user-key":this.api,
			"Content-Type":"application/json",
		},
		credentials: "same-origin"
	};
}
async searchAPI(){
var restaurantURL = new URL(`https://developers.zomato.com/api/v2.1/search?entity_type=city&sort=rating&order=desc&entity_id=${this.id}&
	start=${this.page*5}&count=5`)
const restaurantInfo = await fetch(restaurantURL,this.header);
const restaurantJSON = await restaurantInfo.json();
const restaurantList = await restaurantJSON.restaurants;
console.log(restaurantList);
return {
	restaurantList
	};
 }
}
function setUI(data) {
	const showList=document.getElementById("list");
	data.restaurantList.forEach(async (res)=>{
	var parser = new DOMParser();
	var reviewsURL = new URL(`https://developers.zomato.com/api/v2.1/reviews?res_id=${res.restaurant.id}`)
	const reviewsInfo = await fetch(reviewsURL,{
		method:"GET",
		headers: {
			"user-key":'b104418ca796de06afc6ffa4c404898e',
			"Content-Type":"application/json",
		},
		credentials: "same-origin"
	});
	const reviewsJSON = await reviewsInfo.json();
	console.log(res)	
	showList.append(parser.parseFromString(`	
		<div class="container1" style="background-color:#2E8B57;">
			<a href="../Resturant/resturant.html?id=${res.restaurant.id}">
			<img class="img-response" src="${res.restaurant.featured_image}">
				<div class="innercontainer">
			    <span class="menu-item-title">Restaurant Name - ${res.restaurant.name}</span>
			    <p class="menu-item-details"><img src="Star.png" height="21" width="21"/>${res.restaurant.user_rating.aggregate_rating}
			    	|  (${res.restaurant.user_rating.votes}Votes) ${reviewsJSON.reviews_count}
			    </p>
			</div>
			<hr>
		</div>
		`,"text/html").body.firstElementChild
	
	)
	
})
		var parser = new DOMParser();
	document.getElementById("bigmain").append(parser.parseFromString(`	
		<section class="myButton">
		
		<center>
			<a onclick="changePage()" id="1">1</a>
			<a onclick="changePage()" id="2">2</a>
			<a onclick="changePage()" id="3">3</a>
		</center>
	</section>
		`,"text/html").body.firstElementChild

	)
}
(function() {
	const zomato = new ZOMATO();	
	//add select options
	document.addEventListener("DOMContentLoaded", () => {
		zomato.searchAPI().then(data => setUI(data));
	});
})();





















