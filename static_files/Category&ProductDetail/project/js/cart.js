let cart = {};
if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
}

let tbody = document.getElementById("tbody");

for (let id in cart) {
	
    let item = cart[id];
	
	var str = '<div class="product"><div class="product-image"> </div> <div class="product-details"><div class="product-title">'+item.title+'</div></div><div class="product-price">'+item.price+'</div><div class="product-quantity"><input type="number" value="'+item.qty+'" min="1"></div><div class="product-removal"><button class="remove-product">Remove</button></div><div class="product-line-price">'+(item.price*item.qty).toFixed(2)+	'</div></div>'
	
	div = document.getElementById('tbody');
	
	div.insertAdjacentHTML('beforeend', str);

	/* let div = document.createElement('div');
	div.setAttribute("id","Div"+[id]);
	div.setAttribute("class","product");
	//div.classList.add("product");
	alert(div.getAttribute("id")); //Div1, Div2, Div3, Div4
	tbody.appendChild(div);
	
	//document.getElementById("Div"+[id]).innerHTML = "44.44";
	
	//product image
	let productimagediv = document.createElement('div');
	productimagediv.setAttribute("id", "Productimagediv"+[id]);
	productimagediv.setAttribute("class", "product-details");
	//productimagediv.classList.add("product-details");
	//productimagediv.id = "Productimagediv"+[id];
	//productimagediv.textContent = item.title;

	document.getElementById("Div"+[id]).appendChild(productimagediv); 

	//var docBody = document.getElementById("Div"+[id]);
	//docBody.appendChild(productimagediv);
	document.getElementById("Productimagediv"+[id]).innerHTML = item.title; */
		
	
	//var docBody = document.getElementById("body");
	//div.appendChild(productimagediv);
	//div.appendChild(productimagediv); */
	
	//var div = document.getElementyById("Div1");
	//div.appendChild(productimagediv);
	
	//div.appendChild(productimagediv);
	
	//product details
	//let productdetailsdiv = document.createElement('div');
	//productdetailsdiv.classList.add("product-details")
	//div.appendChild(productdetailsdiv)
	
	//product price
	//let productpricediv = document.createElement('div');
	//productpricediv.innerHTML = "test";
	//productpricediv.id = "Productpricediv"+[id];
	//div.appendChild(productpricediv);
	
	//var element1 = document.getElementById("Productpricediv"+[id]);
	//element1.classList.add("product-price");
	
	//productpricediv.classList.add("product-price");
	//alert(productpricediv.getAttribute("id")); //Productpricediv1, Productpricediv2, Productpricediv3, Productpricediv4
	//alert(item.price); //24.9, 45.5, 39.9, 11.5
	//div.appendChild(productpricediv)
	//document.getElementById("Productpricediv"+[id]).innerHTML = item.price;
	
	//let test = productpricediv.getAttribute("Productpricediv"+[id]);
	//alert(test);
	//alert([id]);
	//alert(document.getElementById("Productpricediv"+[id]));
	
	
	//document.getAttributeById("Div"+[id]).innerHTML = item.price;
	
	//document.getElementById("productprice").innerHTML = item.price;
	
	//document.getElementById("myP").innerHTML = item.price;
	//div.appendChild(productpricediv);
	//alert(div.getAttribute(productpricediv.textContent));
	//var div = document.getElementyById("Div1");
	//div.appendChild(productpricediv);
	
	
	//div.appendChild(productpricediv);
	
	//product quantity
	//let productquantitydiv = document.createElement('div');
	//productquantitydiv.classList.add("product-quantity")
	//productquantitydiv.textContent = item.qty
	//div.appendChild(productquantitydiv)
	
	/* tbody.appendChild(div) */
	

    /* let tr = document.createElement('tr') //create row

    let title_td = document.createElement('td') //create column
    title_td.textContent = item.title 
    tr.appendChild(title_td)

    let price_td = document.createElement("td"); //create column
    price_td.textContent = item.price;
    tr.appendChild(price_td);

    let qty_td = document.createElement("td"); //create column
    qty_td.textContent = item.qty;
    tr.appendChild(qty_td);
	
	let remove_td = document.createElement("td"); //create column
    let btn = document.createElement("button");
	btn.innerHTML = "Remove";
	remove_td.appendChild(btn);
    tr.appendChild(remove_td);

	let total_td = document.createElement("td"); //create column
	total_td.textContent = (item.price*item.qty).toFixed(2);
    tr.appendChild(total_td);

    tbody.appendChild(tr) //append all rows to column

	document.getElementById("producttitle").innerHTML = item.title;
	document.getElementById("productprice").innerHTML = item.price;
	document.getElementById("number1").value = item.qty; */

}
