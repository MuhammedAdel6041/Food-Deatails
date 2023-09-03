let submit;
var userName;
var emailName;
var phone;
var Age;
var password;
var Repassword;
$(document).ready(() => {
    $("#innerLoding").fadeOut(300)
    displayDataApi("").then(() => {
        $('.loader').fadeOut(700, function () {
            $('#loading').fadeOut(700, function () {
                
                $('body').css('overflow', 'auto')
            })
        })
    })
})
/**
 * SIDE NAVIGATION BAR START
 */
let sideList = $('.navigation .inner-nav ').innerWidth();
$('.navigation ').css('left', -sideList)
$('#slideIcon').click(function () {
    if ($('.navigation ').css('left') == '0px') {
        $('.navigation ').animate({ left: -sideList }, 700);

    }
    else {
        $('.navigation ').animate({ left: 0 }, 700);

        $("#close").css("display", "block")
        $("#slideIcon").css("display", "none")
    }
})
$("#close").click(function () {
    $('.navigation ').animate({ left: -sideList }, 700);
    $("#slideIcon").css("display", "block")
    $("#close").css("display", "none")
})
/**
 * FUNCTION DISPLAY DATA
 */

async function displayDataApi() {
    let dispalyApi = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s`);
    let final = await dispalyApi.json()
    displayData(final.meals)
}
displayDataApi()
function displayData(arr) {
    let demo = ``
    for (let count = 0; count < arr.length; count++) {
        demo += `   
        <div class="col-md-3">
            <div onclick="displayMeals(${arr[count].idMeal})" class="meal-content rounded-3">
                <img src="${arr[count].strMealThumb}" class="w-100" alt="" />
                <div class="overlay">
                    <h3>${arr[count].strMeal}</h3>
                </div>
            </div>
        </div>`
    }
    $('#content').html(demo)

}

/**
 * DISPLAY MEALS INFORMATION
 */
async function displayMeals(idmeals) {
    let mealApi = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idmeals}`);
    let finalMeal = await mealApi.json();
    displayMealInfo(finalMeal.meals[0])
}
function displayMealInfo(mealIdInfo) {
    $("#innerLoding").fadeIn(300)
    let ingredients = ``
    for (let i = 1; i <= 20; i++) {
        if (mealIdInfo[`strIngredient${i}`]) {
            ingredients += `<li class="mx-2 my-1 alert alert-info">${mealIdInfo[`strMeasure${i}`]} ${mealIdInfo[`strIngredient${i}`]}</li>`
        }
    }
    let tagStr = (mealIdInfo.strTags)
    let name = tagStr?.split(",")
    if (!name) name = []
    let tag = " "
    for (let i = 0; i < name.length; i++) {
        if (name == null || name == " ") {
            console.log("man");
        }
        else {
            tag += `<li class="mx-2 my-1 alert alert-danger"> ${name[i]}</li>`
        }
    }
    let demo = `
    <div class="col-md-4">
    <div class="right-content text-white "><img
        src="${mealIdInfo.strMealThumb}"
        class="w-100 rounded-3"
        alt=""/>
    <h2>${mealIdInfo.strMeal}</h2>
    </div>
</div>
<div class="col-md-8">
    <div class="left-content">
    <h2>instructions</h2>
        <p> ${mealIdInfo.strInstructions}</p>
    <h3>area : <span>${mealIdInfo.strArea}</span></h3>
    <h3>category : <span>${mealIdInfo.strCategory} </span></h3>
    <h3>recepies : </h3>
    <ul class="flex-wrap" >
${ingredients}
    </ul>
    <h3>Tag : </h3>
    <ul class="flex-wrap" >
    ${tag}
    </ul>
    <div class="btn-groubs mt-5">
    <button class="source btn btn-success"><a target="_blank" href=" ${mealIdInfo.strSource}">source</a></button>
    <button class="youtube btn btn-danger"><a target="_blank" href=" ${mealIdInfo.strYoutube}">youtube</a></button>
    </div>
    </div>
</div>
    `
    $('#content').html(demo)
    $("#searchInput").html("")
    $("#innerLoding").fadeOut(300)
}
/**
 * SEARCH PAGE CODE
 */
async function searchByName(name) {
    let getNameApi = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    let finalSearchName = await getNameApi.json()
    displayData(finalSearchName.meals);
    // searchInput()
}
async function searchByLater(later) {
    let getNameApiLate = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${later}`)
    let nameater = await getNameApiLate.json()
    displayData(nameater.meals);
    // searchInput()
}


function callSearch() {
    $("#innerLoding").fadeIn(300)
    $("#searchInput").html(`<div class="search-input d-flex py-3">
    <input onkeyup="searchByName(this.value)" type="text" placeholder="Search By Name" class="form-control me-3 ">
    <input  onkeyup="searchByLater(this.value)"  maxlength="1" type="text" placeholder="Search By First Letter" class="form-control">
    </div>`)
    $('#content').html("")
    $('.navigation ').animate({ left: -sideList }, 700);
    $("#slideIcon").css("display", "block")
    $("#close").css("display", "none")
    $("#innerLoding").fadeOut(1000)
}
$('#search').click(callSearch)

/**
 * CATEGORIES PAGE CODE
 */
async function getApiCategory() {
    $("#searchInput").html("")
    $("#innerLoding").fadeIn(300)
    let categoryApi = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let categoryRequest = await categoryApi.json();
    getCategory(categoryRequest.categories)
    $("#innerLoding").fadeOut(1000)
}
async function getCategoryDisplay(category_id) {
    let categoryApi = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category_id}`)
    let finalcatApi = await categoryApi.json()
    displayData(finalcatApi.meals)


}
function getCategory(arr) {
    let demo = "";
    for (let count = 0; count < arr.length; count++) {
        demo += ` 
        <div class="col-md-3">
        <div onclick="getCategoryDisplay('${arr[count].strCategory}')" class="meal-content rounded-3 text-center ">
            <img src="${arr[count].strCategoryThumb}" class="w-100" alt="" />
            <div class="overlay  flex-column">
            <h3 class="mt-1">${arr[count].strCategory}</h3>
            <p>"${arr[count].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>
        </div>
    `
    }
    $('#content').html(demo)
}
$('#category').click(function () {
    getApiCategory();
    $('.navigation ').animate({ left: -sideList }, 700);
    $("#slideIcon").css("display", "block")
    $("#close").css("display", "none")
})

/**
 * AREA PAGE CODE
 */

async function getApiArea() {
    $("#searchInput").html("")
    $("#innerLoding").fadeIn(300)
    let areaApi = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let finalReq = await areaApi.json();
    getArea(finalReq.meals)
    $("#innerLoding").fadeOut(1000)
}
async function displayAreaOnclick(areaId) {
    let api_area = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaId}`)
    let final_apiArea = await api_area.json();
    displayData(final_apiArea.meals.slice(0, 20))
}
function getArea(areameals) {
    let demo = ``
    for (let count = 0; count < areameals.length; count++) {
        demo += `
        <div class="col-md-3 py-2  text-center">
        <div onclick="displayAreaOnclick('${areameals[count].strArea}')" class="meal-content text-white  ">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${areameals[count].strArea}</h3>
        </div>
        </div>`
    }
    $('#content').html(demo)
}

$("#area").click(function () {
    getApiArea();
    $('.navigation ').animate({ left: -sideList }, 700);
    $("#slideIcon").css("display", "block")
    $("#close").css("display", "none")
})
/**
 *  INGREDIENT PAGE CODE
 */

async function showIngrediantIcon() {
    $("#searchInput").html("")
    $("#innerLoding").fadeIn(300)
    let getIngrediantApi = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let final_apiIngrediant = await getIngrediantApi.json()
    console.log("welcom");
    displayIconIngrediant(final_apiIngrediant.meals.slice(0, 20))
    $("#innerLoding").fadeOut(1000)

}
async function ingrediantMeal(mealId) {
    let apimeals = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${mealId}`)
    let finlmea = await apimeals.json()
    displayData(finlmea.meals)
}
function displayIconIngrediant(arr) {
    let demo = ``
    for (let count = 0; count < arr.length; count++) {
        demo += `  <div class="col-md-3 py-2 text-center">
        <div onclick="ingrediantMeal('${arr[count].strIngredient}')"  class="meal-content text-white  ">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${arr[count].strIngredient}</h3>
            <p>${arr[count].strDescription.split(" ").slice(0, 20).join(" ")}</p>
        </div>
        </div>

        `
    }
    $('#content').html(demo)
}
$("#ingredient").click(function () {
    showIngrediantIcon();
    $('.navigation ').animate({ left: -sideList }, 700);
    $("#slideIcon").css("display", "block")
    $("#close").css("display", "none")
})


/**
 * ################################
 */
$("#contact").click(function () {
    $("#innerLoding").fadeIn(300)
    $("#content").html(`
     <div class="container w-75 text-center d-flex justify-content-center align-items-center vh-100 ">
    <div class="row g-3 ">
    <div class="col-md-6">
    <input
      type="text"
      id="nameInput"
      placeholder="Enter Your Name"
      class="form-control"
      onkeyup="refName()"
    />
    <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
      Special characters and numbers not allowed
    </div>
  </div>
  <div class="col-md-6">
    <input
    onkeyup="reEmail()"
      id="emailInput"
      type="email"
      placeholder="Enter Your Email"
      class="form-control"
    />
    <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
      Email not valid *exemple@yyy.zzz
    </div>
  </div>
  <div class="col-md-6">
    <input
    onkeyup="rePhoneNumber()"
    
      id="phoneInput"
      type="text"
      placeholder="Enter Your Phone"
      class="form-control"
    />
    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
      Enter valid Phone Number
    </div>
  </div>
  <div class="col-md-6">
    <input
      onkeyup=" reAge()"
      id="ageInput"
      type="number"
      placeholder="Enter Your Age"
      class="form-control"
    />
    <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
      Enter valid age
    </div>
  </div>
  <div class="col-md-6">
    <input
    onkeyup="rePassword()"
      id="passwordInput"
      type="password"
      placeholder="Enter Your password"
      class="form-control"
    />
    <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
      Enter valid password *Minimum eight characters, at least one letter and one
      number:*
    </div>
  </div>
  <div class="col-md-6">
    <input
    onkeyup="rePasswordReapet()"
      id="repasswordInput"
      type="password"
      placeholder="Reapet Your password"
      class="form-control"
    />
    <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
      Enter valid repassword
    </div>
  </div>
  <div class="gy-5">
   <button class="btn btn-danger form-control" disabled id="submit-btn">submit</button>
  </div>
 
        
    </div>
    </div>`)
    submit = document.getElementById("submit-btn")
    userName = document.getElementById('nameInput');
    emailName = document.getElementById('emailInput');
    phone = document.getElementById('phoneInput');
    Age = document.getElementById('ageInput');
    password = document.getElementById('passwordInput');
    Repassword = document.getElementById('repasswordInput');
    $('.navigation ').animate({ left: -sideList }, 700);
    $("#slideIcon").css("display", "block")
    $("#close").css("display", "none")

    $("#innerLoding").fadeOut(1000)
})



function refName() {
    let regex = /^[a-zA-Z ]+$/gm
    if (regex.test(userName.value) == true) {
        document.getElementById("nameAlert").classList.replace("d-block", "d-none")
    }
    else {
        document.getElementById("nameAlert").classList.replace("d-none", "d-block")

    }
}
function reEmail() {
    let regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm
    if (regex.test(emailName.value) == true) {
        document.getElementById("emailAlert").classList.replace("d-block", "d-none")
    } else {
        document.getElementById("emailAlert").classList.replace("d-none", "d-block")

    }
}
function rePhoneNumber() {
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gm
    if (regex.test(phone.value) == true) {
        document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
    }
    else {
        document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

    }
}
function reAge() {
    let regex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/gm
    if (regex.test(Age.value) == true) {
        document.getElementById("ageAlert").classList.replace("d-block", "d-none")
    } else {
        document.getElementById("ageAlert").classList.replace("d-none", "d-block")

    }
}
function rePassword() {
    let regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/gm
    if (regex.test(password.value) == true) {
        document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
       
    } else {
        document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

    }
}

function rePasswordReapet() {
    if(document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value){
        $("#submit-btn").attr("disabled", false);
    }else{
        $("#submit-btn").attr("disabled", true);
    }
}




