const pokemonRandom = document.getElementById( "pokemonRandom" );
const pokemonSearch = document.getElementById( "pokemonSearch" );
const pokemonAbilities = document.getElementById( "pokemonAbilities" );
const pokemonAbilities2 = document.getElementById( "pokemonAbilities2" );
const pokemonAbilities3 = document.getElementById( "pokemonAbilities3" );
const pokemonName = document.getElementById( "pokemonName" );
const pokemonType = document.getElementById( "pokemonType" );
const pokemonImg = document.getElementById( "pokemonImg" );
const pokemonNormal = document.getElementById( "pokemonNormal" );
const pokemonShiny = document.getElementById( "pokemonShiny" );
const pokemonLocation = document.getElementById( "pokemonLocation" );
const pokemonNumber = document.getElementById( "pokemonNumber" );
const pokemonEvolution = document.getElementById( "pokemonEvolution" );
const pokemonMoves = document.getElementById( "pokemonMoves" );
const pokemonEvoLine = document.getElementById( "pokemonEvoLine" );
const catchPokemon = document.getElementById( "catchPokemon" );
const favoritesPage = document.getElementById( "favoritesPage" );
const caughtExit = document.getElementById( "caughtExit" );
const mainPage = document.getElementById( "mainPage" );
const pokemonCaught = document.getElementById( "pokemonCaught" );
const caughtPokemon = document.getElementById( "caughtPokemon" );

const pokeData = async (data) =>
{
    const location = await fetch( data.location_area_encounters );
    const locData = await location.json();
    const species = await fetch( data.species.url );
    const specData = await species.json();
    const evoChain = await fetch ( specData.evolution_chain.url );
    const evoData = await evoChain.json();

    let pokemonAbilityList = [];
    let abilities = data.abilities;
    abilities.forEach(ability =>
    {
        let abilityDash = ability.ability.name.indexOf("-") + 1;

        if ( ability.ability.name.includes("-") )
        {
            pokemonAbilityList[pokemonAbilityList.length] =
            ability.ability.name[0].toUpperCase() +
            ability.ability.name.slice(1, abilityDash) +
            ability.ability.name[abilityDash].toUpperCase() +
            ability.ability.name.slice(abilityDash + 1);
        }else
        {
            pokemonAbilityList[pokemonAbilityList.length] =
            ability.ability.name[0].toUpperCase() +
            ability.ability.name.slice(1);
        }
    });
    pokemonAbilities.innerText = pokemonAbilityList.join(", ");

    pokemonNumber.innerText = `#${data.id}`;
    pokemonName.innerText = data.name[0].toUpperCase() + data.name.slice(1);
    pokemonType.innerText = data.types[0].type.name[0].toUpperCase() + data.types[0].type.name.slice(1);
    pokemonImg.src = data.sprites.front_default;
    if ( locData.length !== 0 )
    {
        pokemonLocation.innerText = locData[0].location_area.name[0].toUpperCase() + locData[0].location_area.name.slice(1);
    }else
    {
        pokemonLocation.innerText = "Location N/A";
    }

    const evoDataBase = evoData.chain.species.name;
    const evoDataChain = evoData.chain.evolves_to;

    // Figuring out the evolution line was thanks to Kass helping me
    let evoList = [];
    if ( evoDataChain.length > 0 )
    {
        const response = await fetch( `https://pokeapi.co/api/v2/pokemon/${evoDataBase}` );
        const data = await response.json();

        if ( data.id <= 649 )
        {
            evoList[evoList.length] = evoDataBase[0].toUpperCase() + evoDataBase.slice(1);
            for ( let i = 0; i < evoDataChain.length; i++ )
            {
                const response = await fetch( `https://pokeapi.co/api/v2/pokemon/${evoDataChain[i].species.name}` );
                const data = await response.json();
                if ( data.id <= 649 )
                {
                    evoList[evoList.length] = evoDataChain[i].species.name[0].toUpperCase() + evoDataChain[i].species.name.slice(1);
        
                    if ( evoDataChain[i].evolves_to.length > 0 )
                    {
                        for ( let j = 0; j < evoDataChain[i].evolves_to.length; j++ )
                        {
                            const response = await fetch( `https://pokeapi.co/api/v2/pokemon/${evoDataChain[i].evolves_to[j].species.name}` );
                            const data = await response.json();
                            if ( data.id <= 649 )
                            {
                                evoList[evoList.length] = evoDataChain[i].evolves_to[j].species.name[0].toUpperCase() + evoDataChain[i].evolves_to[j].species.name.slice(1);
                            }
                        }
                    }
                }
            }
        }
        pokemonEvoLine.innerText = evoList.join(", ");
    }else
    {
        pokemonEvoLine.innerText = "N/A";
        pokemonEvolution.innerText = "N/A";
    }

    if ( evoDataBase === "eevee" )
    {
        let rng = Math.floor( Math.random() * (evoList.length - 1) ) + 1;
        pokemonEvolution.innerText = evoList[evoList.indexOf( pokemonName.innerText ) + rng];
    }else if ( evoList.includes( pokemonName.innerText ) )
    {
        pokemonEvolution.innerText = evoList[evoList.indexOf( pokemonName.innerText ) + 1];
    }

    if ( pokemonEvolution.innerText === "undefined" )
    {
        pokemonEvolution.innerText = "N/A";
    }else if ( evoList[0] === "Eevee" && pokemonName.innerText !== "Eevee" )
    {
        pokemonEvolution.innerText = "N/A";
    }

    let pokemonMoveList = [];
    let moves = data.moves;
    moves.forEach(move => {
        let moveDash = move.move.name.indexOf("-") + 1;

        if ( move.move.name.includes("-") )
        {
            pokemonMoveList[pokemonMoveList.length] =
            move.move.name[0].toUpperCase() +
            move.move.name.slice(1, moveDash) +
            move.move.name[moveDash].toUpperCase() +
            move.move.name.slice(moveDash + 1);
        }else
        {
            pokemonMoveList[pokemonMoveList.length] =
            move.move.name[0].toUpperCase() +
            move.move.name.slice(1);
        }
    });
    pokemonMoves.innerText = pokemonMoveList.join(", ");

    let name = pokemonName.innerText;
    let pokemonStored = getFromLocalStorage();
    if ( pokemonStored.includes( name ) )
    {
        catchPokemon.innerText = "Caught!";
    }else
    {
        catchPokemon.innerText = "Catch!";
    }
}

const getPokemon = async () =>
{
    const response = await fetch( "https://pokeapi.co/api/v2/pokemon/1" );
    const data = await response.json();
    pokeData( data );
}

getPokemon();

pokemonRandom.addEventListener( "click", async () =>
{
    let rng = Math.floor( Math.random() * (649 - 1 + 1) ) + 1;
    const response = await fetch( `https://pokeapi.co/api/v2/pokemon/${rng}` );
    const data = await response.json();
    pokeData( data );
});

pokemonSearch.addEventListener( "keydown", async (enter) =>
{
    if ( enter.key === "Enter" )
    {
        try
        {
            const userInput = pokemonSearch.value;
            const response = await fetch( `https://pokeapi.co/api/v2/pokemon/${userInput}` );
            const data = await response.json();
            if ( data.id <= 649 )
            {
                pokeData( data );
                pokemonSearch.value = "";
                pokemonSearch.placeholder = "Locate a Pokemon"
            }else
            {
                pokemonSearch.value = "";
                pokemonSearch.placeholder = "Pokemon Unavailable";
            }
        } catch (error)
        {
            pokemonSearch.value = "";
            pokemonSearch.placeholder = "Pokemon Unavailable";
        }
    }
});

pokemonEvolution.addEventListener ( "click", async () =>
{
    const response = await fetch( `https://pokeapi.co/api/v2/pokemon/${pokemonEvolution.innerText}` );
    const data = await response.json();
    pokeData( data );
});

pokemonShiny.addEventListener ( "click", async () =>
{
    const response = await fetch( `https://pokeapi.co/api/v2/pokemon/${pokemonName.innerText}` );
    const data = await response.json();
    pokemonImg.src = data.sprites.front_shiny;
});

pokemonNormal.addEventListener ( "click", async () =>
{
    const response = await fetch( `https://pokeapi.co/api/v2/pokemon/${pokemonName.innerText}` );
    const data = await response.json();
    pokemonImg.src = data.sprites.front_default;
});

caughtExit.addEventListener( "click", () =>
{
    favoritesPage.classList.add( "hidden" );
    mainPage.classList.remove( "hidden" );
});

catchPokemon.addEventListener( "click", () =>
{
    let name = pokemonName.innerText;
    let pokemonStored = getFromLocalStorage();

    if ( !pokemonStored.includes( name ) )
    {
        pokemonStored[ pokemonStored.length ] = name;
    }
    localStorage.setItem( "CaughtPokemon", JSON.stringify( pokemonStored ) );

    catchPokemon.innerText = "Caught!";
});

const getFromLocalStorage = () =>
{
    let localStorageData = localStorage.getItem( "CaughtPokemon" );

    if( localStorageData == null ){
        return [];
    }

    return JSON.parse( localStorageData );
}

const removeFromLocalStorage = ( name ) =>
{
    let localStorageData = getFromLocalStorage();

    let nameIndex = localStorageData.indexOf( name );

    localStorageData.splice( nameIndex, 1 );

    localStorage.setItem( "CaughtPokemon", JSON.stringify(localStorageData) );
}

pokemonCaught.addEventListener( "click", () =>
{
    mainPage.classList.add( "hidden" );
    favoritesPage.classList.remove( "hidden" );
    caughtPokemon.innerText = "";
    let pokemonStored = getFromLocalStorage();
    console.log( pokemonStored );

    pokemonStored.map(pokemon =>
    {
        let favDiv = document.createElement( "div" );
        favDiv.type = "div";

        let searchPokeBtn = document.createElement( "button" );
        searchPokeBtn.type = "button";
        searchPokeBtn.className = "hover:bg-white/15 hover:cursor-pointer bg-black/60 outline rounded-[5px] w-[200px] text-center p-[10px] m-[5px]";
        searchPokeBtn.innerText = pokemon;

        let releaseBtn = document.createElement( "button" );
        releaseBtn.type = "button";
        releaseBtn.className = "hover:bg-white/15 hover:cursor-pointer bg-red-400/60 outline rounded-[5px] h-[35px] w-[200px] text-center mb-[10px]";
        releaseBtn.innerText = "Release";

        searchPokeBtn.addEventListener( "click", async () =>
        {
            favoritesPage.classList.add( "hidden" );
            mainPage.classList.remove( "hidden" );
            const response = await fetch( `https://pokeapi.co/api/v2/pokemon/${searchPokeBtn.innerText}` );
            const data = await response.json();
            pokeData( data );
        });

        releaseBtn.addEventListener( "click", async () =>
        {
            removeFromLocalStorage( pokemon );
            favDiv.remove();

            if ( pokemonName.innerText === pokemon )
            {
                catchPokemon.innerText = "Catch!";
            }
        });

        favDiv.appendChild( searchPokeBtn );
        favDiv.appendChild( releaseBtn );

        caughtPokemon.appendChild( favDiv );
    });
});