class ZOMATO {
constructor(id) {
	this.api = "b104418ca796de06afc6ffa4c404898e";
	this.url=new URL(window.location.href)
	this.id=parseInt(this.url.searchParams.get("id"))
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
var restaurantURL = new URL(`https://developers.zomato.com/api/v2.1/restaurant?res_id=${this.id}`)
	const restaurantInfo = await fetch(restaurantURL,this.header);
	const restaurantJSON = await restaurantInfo.json();
var cuisinesURL = new URL(`https://developers.zomato.com/api/v2.1/cuisines?city_id=${restaurantJSON.location.city_id}&start=${0}&count=5`)
	const cuisinesInfo = await fetch(cuisinesURL,this.header);
	const cuisinesJSON = await cuisinesInfo.json();
var reviewsURL = new URL(`https://developers.zomato.com/api/v2.1/reviews?res_id=${this.id}`)
	const reviewsInfo = await fetch(reviewsURL,this.header);
	const reviewsJSON = await reviewsInfo.json();	
return {
	cuisinesJSON,
		restaurantJSON,
		reviewsJSON
	};
  }
} 
function setUI(data) {
	const restName=document.getElementById("rname");
	const {name,user_rating,featured_image,average_cost_for_two,location:{locality_verbose}} =data.restaurantJSON;
	restName.innerHTML = name 
	const rating=document.getElementById("rate");
	const {reviews_count} =data.reviewsJSON;
	rating.innerHTML = `<img src="Star.png" height="23" width="23"/> ${user_rating.aggregate_rating} (${user_rating.votes}Votes) | ${reviews_count}Reviews`
	const pic = document.getElementById("first_box")
	pic.style.backgroundImage = `url('${featured_image}')`;
	const pri=document.getElementById("cost");
	pri.innerHTML = `Rs ${average_cost_for_two}` 
	const dres=document.getElementById("address");
	dres.innerHTML = locality_verbose
	const menu2=document.getElementById("item2");
	const cuisineList=document.getElementById("menu_inner");
		var parser = new DOMParser();

	data.cuisinesJSON.cuisines.slice(0,3).forEach((cuisine,index) => {
	cuisineList.append(
			parser.parseFromString(`
				<div>
				<h1 id="p${index+1}" >Cuisine ID: ${cuisine.cuisine.cuisine_id}</h1>
				<p id="item${index+1}">Cuisine Name: ${cuisine.cuisine.cuisine_name}</p>
				
				</div>
			`,"text/html").body.firstElementChild
		)
	});

	const reviewsList=document.getElementById("inner_box5");
		var parser = new DOMParser();

	data.reviewsJSON.user_reviews.forEach((reviews,index) => {
	reviewsList.append(
			parser.parseFromString(`
				<div>
				<section id="cir" style="background-image:url(${reviews.review.user.profile_image})"> </section>
				<section id="info">
				<h1>${reviews.review.user.name}</h1>
				<img src="Star.png" height="23" width="23"/><img src="Star.png" height="23" width="23"/><img src="Star.png" height="23" width="23"/><img src="hollow.png" height="23" width="23"/>
				<p>${reviews.review.review_text}</p>
			</section>
			
			`,"text/html").body.firstElementChild
		)
	});
	console.log(data.restaurantJSON)
	console.log(data.cuisinesJSON)
	console.log(data.reviewsJSON)
	
}

(function() {
	const zomato = new ZOMATO();	
	//add select options
	document.addEventListener("DOMContentLoaded", () => {
		zomato.searchAPI().then(data => setUI(data));
	});
})();