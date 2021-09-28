// note: API here: https://forkify-api.herokuapp.com/v2
/*
Available search queries
carrot
broccoli
asparagus
cauliflower
corn
cucumber
green pepper
lettuce
mushrooms
onion
potato
pumpkin
red pepper
tomato
beetroot
brussel sprouts
peas
zucchini
radish
sweet potato
artichoke
leek
cabbage
celery
chili
garlic
basil
coriander
parsley
dill
rosemary
oregano
cinnamon
saffron
green bean
bean
chickpea
lentil
apple
apricot
avocado
banana
blackberry
blackcurrant
blueberry
boysenberry
cherry
coconut
fig
grape
grapefruit
kiwifruit
lemon
lime
lychee
mandarin
mango
melon
nectarine
orange
papaya
passion fruit
peach
pear
pineapple
plum
pomegranate
quince
raspberry
strawberry
watermelon
salad
pizza
pasta
popcorn
lobster
steak
bbq
pudding
hamburger
pie
cake
sausage
tacos
kebab
poutine
seafood
chips
fries
masala
paella
som tam
chicken
toast
marzipan
tofu
ketchup
hummus
chili
maple syrup
parma ham
fajitas
champ
lasagna
poke
chocolate
croissant
arepas
bunny chow
pierogi
donuts
rendang
sushi
ice cream
duck
curry
beef
goat
lamb
turkey
pork
fish
crab
bacon
ham
pepperoni
salami
ribs

*/



// activate strict mode
"use strict";





// capturing DOM elements
const appBodyRightWindow = document.getElementById("appBodyRightWindow");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const recipesContainer = document.getElementById("recipesContainer");
const RecipePage = document.getElementById("RecipePage");























async function gettingMenuRecipes (query)
{
    try 
    {

        // get the recipes
        let response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`);
        let data = await response.json();

        console.log(data.data.recipes.length);


        // error handling
        if (!data || data.data.recipes.length === 0)
        {
            throw new Error("no recipes were found! ⚠");
            return;
        }

        if (!response.ok)
        {
            throw new Error(`${data.message} (${response.status})`);
        }



        // getting recipe
        let recipeObject = data.data.recipes;


        // console.log(recipeObject);

        // inserting data into DOM elements

        // clear container first
        recipesContainer.innerHTML = "";

        // insert data and render it
        recipeObject.forEach( function (recipe) 
        {

            let recipeEl = `<a href="#${recipe.id}" class="appBody-left-window-recepie-option">
                <div class="appBody-left-window-recepie-option-img"><img src="${recipe.image_url}" alt="Cauliflower Pizza Crust (with BBQ Chicken Pizza)"></div>
                <div class="appBody-left-window-recepie-option-title"><p>${recipe.title}</p></div>
                <div class="appBody-left-window-recepie-option-publisher"><p>${recipe.publisher}</p></div>
            </a>`;

            recipesContainer.insertAdjacentHTML("beforeend" , recipeEl);
            
        });

        // show pages
        if( RecipePage.classList.contains("hidden") ) RecipePage.classList.remove("hidden");


    }
    catch(e)
    {
        alert(e);
    }
}






// searchRecipes
// standard javaScript documentaion 👇🏻
/**
 * a function to search for a recipes when event click triggered.
 * @param {event} e a click event trigggering the function  
 */
function searchRecipes (e)
{
    // preventing default behaviour
    e.preventDefault();

    // getting search engine text
    let searchValue = searchInput.value;

    // get data from API for our query
    gettingMenuRecipes (searchValue);

    // clear search field
    searchInput.innerHTML = "";
}





// load recipe
function loadRecipe ()
{

    let hashValue = window.location.hash;
    hashValue = hashValue.slice(1);

    if (!hashValue) return;


    // fetch the recipe
    getRecipe(hashValue);
}






// loading screen function
function loadingScreen(containerEl)
{
    let loaderEl = `<div class="appBody-right-window-loading-message"><p>🍜Loading......</p></div>`;

    containerEl.innerHTML = "";
    containerEl.insertAdjacentHTML("afterbegin" , loaderEl);
}





// getting data from api
async function getRecipe (recId)
{

    try 
    {


        // loading screen while data is being fetched
        loadingScreen(appBodyRightWindow);

        let response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${recId}`);
        let data = await response.json();

        // error handling
        if (!response.ok)
        {
            throw new Error(`${data.message} (${response.status})`);
        }

        // getting recipe
        let recipeObject = data.data.recipe;

        let recipe = {
            id: recipeObject.id,
            title: recipeObject.title,
            publisher: recipeObject.publisher,
            sourceURL: recipeObject.source_url,
            image: recipeObject.image_url,
            servings: recipeObject.servings,
            cookingTime: recipeObject.cooking_time,
            ingredients: recipeObject.ingredients
        };

        console.log(data);
        console.log(recipe);

        // rrnder a recipe in DOM
        let recipeEl = `<div class="recipe">
        <div class="recipe-header">
            <img class="recipe-header-img" src="${recipe.image}" alt="${recipe.title}">
        </div>
        <div class="recipe-body">

            <div class="recipe-body-header">
                <p>${recipe.title}</p>
            </div>

            <div class="recipe-body-data">
                <div>🍳servings: ${recipe.servings}</div>
                <div>⏲cooking Time: ${recipe.cookingTime}</div>
                <div>👨🏻‍🍳publisher: ${recipe.publisher}</div>
            </div>

            <div class="recipe-body-ingredients">
                ${recipe.ingredients.map(el => { return `<div class="recipe-body-ingredients-unit"><p>🍅${el.description} : <span>${el.quantity === null ? 0 : el.quantity} ${el.unit}</span></p></div>`;}).join(" ")}
            </div>

        </div>
    </div>`;

    appBodyRightWindow.innerHTML = "";
    appBodyRightWindow.insertAdjacentHTML("afterbegin",recipeEl);


    }
    catch(e)
    {
        alert(e);
    }

}


// events

["hashchange","load"].forEach( el => window.addEventListener(el , loadRecipe) );
searchBtn.addEventListener("click" , searchRecipes);


