const API_KEY = '5b182e5d29c2460bbbc0d76714faee64';
const BASE_URL = 'https://api.spoonacular.com/recipes/findByIngredients';


async function getRecipes() {
    const ingredients = document.getElementById('ingredients').value.trim();
   
    if (!ingredients) {
        alert("Please enter some ingredients.");
        return;
    }


    // Split ingredients by commas and remove extra spaces
    const ingredientsList = ingredients.split(',').map(item => item.trim()).join(',');
   
    const url = `${BASE_URL}?ingredients=${ingredientsList}&number=5&apiKey=${API_KEY}`;


    try {
        const response = await fetch(url);
        const recipes = await response.json();


        if (recipes.length === 0) {
            document.getElementById('recipe-list').innerHTML = '<p>No recipes found with these ingredients.</p>';
            return;
        }


        displayRecipes(recipes, ingredientsList.split(',').map(ingredient => ingredient.trim()));
    } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('There was an error fetching recipes. Please try again later.');
    }
}


function displayRecipes(recipes, userIngredientsArray) {
    const recipeListDiv = document.getElementById('recipe-list');
    recipeListDiv.innerHTML = '';  


    // Calculate match percentages and add them to each recipe
    recipes.forEach(recipe => {
        const matchPercentage = calculateMatchPercentage(userIngredientsArray, recipe.missedIngredients, recipe.usedIngredients);
        recipe.matchPercentage = matchPercentage; // Add match percentage to the recipe object
    });


    recipes.sort((a, b) => b.matchPercentage - a.matchPercentage);
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');


        const title = document.createElement('h3');
        title.textContent = recipe.title;
        recipeCard.appendChild(title);


        const ingredientsList = document.createElement('ul');
        recipe.usedIngredients.forEach(ingredient => {
            const listItem = document.createElement('li');
           
            listItem.textContent = ingredient.name;
            ingredientsList.appendChild(listItem);
        });


        recipeCard.appendChild(ingredientsList);


        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('img-wrapper');
        if (recipe.image) {
            const img = document.createElement('img');
            img.src = recipe.image;
            img.alt = recipe.title;
            img.width = 200;
            imgWrapper.appendChild(img);
        }
        const progressBarWrapper = document.createElement('div');
        progressBarWrapper.classList.add('progress-bar-wrapper');
       
        const circularProgressBar = createCircularProgressBar(recipe.matchPercentage);
        progressBarWrapper.appendChild(circularProgressBar);
       
        imgWrapper.appendChild(progressBarWrapper);
        recipeCard.appendChild(imgWrapper);


        const missingIngredients = getMissingIngredients(userIngredientsArray, recipe.usedIngredients, recipe.missedIngredients);


        const missingIngredientsList = document.createElement('p');
        missingIngredientsList.textContent = `Missing Ingredients: ${missingIngredients.join(', ')}`;
        recipeCard.appendChild(missingIngredientsList);


        const recipeLink = document.createElement('a');
        recipeLink.href = `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}`;
        recipeLink.target = "_blank";
        recipeLink.textContent = "See Full Recipe";
        recipeCard.appendChild(recipeLink);


        recipeListDiv.appendChild(recipeCard);
    });
}


function createCircularProgressBar(percentage) {
   
    const progressWrapper = document.createElement('div');
    progressWrapper.classList.add('circular-progress-wrapper');
   
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");
    svg.setAttribute("viewBox", "0 0 36 36");
    svg.setAttribute("class", "circular-progress");


    const track = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    track.setAttribute("cx", "18");
    track.setAttribute("cy", "18");
    track.setAttribute("r", "15.9");
    track.setAttribute("stroke", "#f3f3f3");
    track.setAttribute("stroke-width", "2");
    track.setAttribute("fill", "none");
    svg.appendChild(track);


    const progress = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    progress.setAttribute("cx", "18");
    progress.setAttribute("cy", "18");
    progress.setAttribute("r", "15.9");
    progress.setAttribute("stroke", "#72000b");
    progress.setAttribute("stroke-width", "2");
    progress.setAttribute("fill", "none");
    progress.setAttribute("stroke-dasharray", "100, 100");
    progress.setAttribute("stroke-dashoffset", 100 - percentage);
    svg.appendChild(progress);


    const percentageText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    percentageText.setAttribute("x", "18");
    percentageText.setAttribute("y", "14");
    percentageText.setAttribute("font-size", "6");
    percentageText.setAttribute("text-anchor", "middle");
    percentageText.setAttribute("fill", "#333");
    percentageText.textContent = `${percentage}%`;


    const matchText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    matchText.setAttribute("x", "18");
    matchText.setAttribute("y", "22");
    matchText.setAttribute("font-size", "4");
    matchText.setAttribute("text-anchor", "middle");
    matchText.setAttribute("fill", "#333");
    matchText.textContent = "Match";


    svg.appendChild(percentageText);
    svg.appendChild(matchText);
    progressWrapper.appendChild(svg);


    return progressWrapper;
}






function getMissingIngredients(userIngredientsArray, usedIngredients, missedIngredients) {
    const missingIngredients = [];
    const allIngredients = [...usedIngredients, ...missedIngredients];


    // Convert user ingredients to lowercase for case-insensitive comparison
    const lowerCaseUserIngredients = userIngredientsArray.map(item => item.toLowerCase());


    allIngredients.forEach(ingredient => {
        const ingredientNameLower = ingredient.name.toLowerCase();
        if (!lowerCaseUserIngredients.includes(ingredientNameLower)) {
            missingIngredients.push(ingredient.name);  // Only add missing ingredients
        }
    });
    return missingIngredients;
}


function calculateMatchPercentage(userIngredientsArray, missedIngredients, usedIngredients) {
    const allRequiredIngredients = [...usedIngredients, ...missedIngredients];
    const lowerCaseUserIngredients = userIngredientsArray.map(item => item.toLowerCase());
    const matchedIngredientsCount = usedIngredients.filter(ingredient =>
        lowerCaseUserIngredients.includes(ingredient.name.toLowerCase())
    ).length;
    const matchPercentage = (matchedIngredientsCount / allRequiredIngredients.length) * 100;
    return matchPercentage.toFixed(2);
}



