

let url = "https://pokeapi.co/api/v2/pokemon/"


class PokeDeck {
    static async fillCard(card, pokemonId) {

        let url = "https://pokeapi.co/api/v2/pokemon/" + pokemonId;

        let pokemonData = await Utilities.pokeAPI(url);
        //console.log(pokemonData);
        //chosenpokemon = pokemonData.id
        console.log(pokemonId)

        card.querySelector(".minicard").innerHTML = ""
        //Añadir el boton de Favoritos
        let botoncarrito = card.querySelector(".CartButton")
        botoncarrito.dataset.id = pokemonData.id
        botoncarrito.dataset.name = pokemonData.name
        botoncarrito.dataset.img = pokemonData.sprites.front_default

        //TIPO DEL POKEMON
        let tipos = []
        for (let i = 0; i < pokemonData.types.length; i++) {
            tipos.push(pokemonData.types[i].type.name)
        }
        console.log(tipos)
        PokeDeck.loadTypes(card, tipos)
        PokeDeck.findColors()
        // Imagen
        let img = card.querySelector("span img ")
        img.src = pokemonData.sprites.front_default;

        //Numero
        card.querySelector('h3').innerHTML = "<strong> Nº : </strong>  " + pokemonData.id

        // Nombre
        card.querySelector('h5').innerHTML = pokemonData.name;

        // Descripción, accede a los textos en species y filtra por idioma
        let species = await Utilities.pokeAPI(pokemonData.species.url); // nueva llamada a la API
        //APLICAR FONDO A LA CARTA
        card.style.borderColor = species.color.name; // cambio el CSS desde Javascript--> https://www.w3schools.com/jsref/dom_obj_style.asp
        let texts = species.flavor_text_entries; // Array de descripciones (las hay en muchos idiomas)
        let filtrados = texts.filter((text) => text.language.name == 'es'); // se queda con las que tengan el código de idioma que queremos

        if (filtrados.length > 0) {
            card.querySelector('.card-text').innerHTML = filtrados[0].flavor_text; // mete el primero en el HTML
        } else {
            // si no hay traducción en el idioma deseado mete el primero que haya
            card.querySelector('.card-text').innerHTML = texts[0].flavor_text;
        }

        // Lista UL de habilidades
        let abilitiesAccordion = card.querySelector('.accordion');
        abilitiesAccordion.innerHTML = '';
        let abilitiesurl = []
        for (let x = 0; x < pokemonData.abilities.length; x++) {
            abilitiesurl.push(pokemonData.abilities[x].ability.url)
        }

        let abilitiesdescription = []
        for (let x = 0; x < abilitiesurl.length; x++) {
            let descripcion = await Utilities.pokeAPI(abilitiesurl[x])
            abilitiesdescription.push(descripcion)
        }

        let descriptions = []

        for (let x = 0; x < abilitiesdescription.length; x++) {

            descriptions.push(abilitiesdescription[x].flavor_text_entries.find((e) => e.language.name == "en").flavor_text)

        }
        for (let i = 0; i < pokemonData.abilities.length; i++) {
            let x = Math.floor(Math.random() * 1e10)

            // OPCION 1: Crear un string con el HTML y añadirlo al elemento padre
            abilitiesAccordion.innerHTML += `<div class="accordion-item">
                                        <h2 class="accordion-header" id="heading${x}">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapse${x}" aria-expanded="false" aria-controls="collapse${x}">
                                        ${pokemonData.abilities[i].ability.name}
                                    </button>
                                    </h2>
                                    <div id="collapse${x}" class="accordion-collapse collapse "
                                    aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <strong>${descriptions[i]}
                                        </div>
                                        </div>`
        }



        //COMPROBAR EVOLUCIONES
        let pagpevolution1 = await Utilities.pokeAPI(pokemonData.species.url)
        let pagfinalevolution = await Utilities.pokeAPI(pagpevolution1.evolution_chain.url)
        if (pagfinalevolution) {

            let evolutions = []
            let evo = pagfinalevolution.chain.species.url
            evo = evo.substring(0, evo.length - 1)
            let ultimabarra = evo.lastIndexOf("/")
            evo = evo.substring(ultimabarra + 1, evo.length)


            evolutions.push(evo)
            for (let i = 0; i < pagfinalevolution.chain.evolves_to.length; i++) {

                let evo1 = pagfinalevolution.chain.evolves_to[i].species.url
                evo1 = evo1.substring(0, evo1.length - 1)
                let ultimabarra = evo1.lastIndexOf("/")
                evo1 = evo1.substring(ultimabarra + 1, evo1.length)
                evolutions.push(evo1)
                if (pagfinalevolution.chain.evolves_to[i].evolves_to) {
                    for (let x = 0; x < pagfinalevolution.chain.evolves_to[i].evolves_to.length; x++) {
                        let evo2 = pagfinalevolution.chain.evolves_to[i].evolves_to[x].species.url
                        console.log(evo2)
                        evo2 = evo2.substring(0, evo2.length - 1)
                        let ultimabarra = evo2.lastIndexOf("/")
                        evo2 = evo2.substring(ultimabarra + 1, evo2.length)
                        evolutions.push(evo2)
                    }
                }
            }

            console.log(evolutions)
            for (let i = 0; i < evolutions.length; i++) {
                let evolutions_0 = await Utilities.pokeAPI("https://pokeapi.co/api/v2/pokemon/" + evolutions[i])
                card.querySelector(".minicard").innerHTML += this.addMiniCard(evolutions_0)

            }
        }
    }


    static addMiniCard(pokemonData) {

        return `
                <figure class="figure">
                
                    <img src="${pokemonData.sprites.front_default}" class="figure-img img-fluid rounded" 
                    onclick=PokeDeck.fillCard(this.closest(".card"),${pokemonData.id}) >
                    <figcaption class="figure-caption"></figcaption>
                    <p class="">${pokemonData.name}</p>
                </figure>
                `

    }


    static async addCard(pokemonId = Utilities.randomPokemonNumber()) {
        document.querySelector(".addcard").disabled = true

        //Añado el HTML
        let deck = document.querySelector(".deck")
        //CARD
        deck.innerHTML += `
                <div class="boxcard d-inline-block m-2 mt-5">
                <div class="m-2 pt-2 card " style="width: 18rem;">
                    <div class="container text-center">
                        <div class="row align-items-center">
                            <div>
                            
                                <div class="col">
                                    <strong><h3 style="font-family:'PokemonFont',monospace; font-size:20px; ">Pokemon number</h3> </strong>
                                </div>
                                
                                <div class="col typeslogo">
                                </div>
                            </div>
                        </div>
                    </div>

                        <span>
                            <img src="./images/pokeball.png" class="card-img-top" id="pokemonimage" alt="...">
                        </span>
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text"></p>
                            <h6 class="text-black text-decoration-underline"> Habilidades </h6>

                            <div class="accordion" id="accordionExample">
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="headingOne">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne" aria-expanded="true"
                                            aria-controls="collapseOne">
                                            Acordeón artículo #1
                                        </button>
                                    </h2>
                                    <div id="collapseOne" class="accordion-collapse collapse show"
                                        aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                        <div class="accordion-body">
                                            <strong>Este es el cuerpo del acordeón del primer elemento.</strong> 
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="headingTwo">
                                        <button class="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse" data-bs-target="#collapseTwo"
                                            aria-expanded="false" aria-controls="collapseTwo">
                                            Acordeón artículo #2
                                        </button>
                                    </h2>
                                    <div id="collapseTwo" class="accordion-collapse collapse"
                                        aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                        <div class="accordion-body">
                                            <strong>Este es el cuerpo del acordeón del segundo elemento.</strong>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="headingThree">
                                        <button class="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse" data-bs-target="#collapseThree"
                                            aria-expanded="false" aria-controls="collapseThree">
                                            Acordeón artículo #3
                                        </button>
                                    </h2>
                                    <div id="collapseThree" class="accordion-collapse collapse"
                                        aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                        <div class="accordion-body">
                                            <strong>Este es el cuerpo del acordeón del tercer elemento.</strong>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="minicard">

                            </div>

                            <hr>
                            Nº= <input id="pokevalue" style="width:140px;" type="text"
                                onchange=PokeDeck.fillCard(this.parentNode.parentNode,this.value)>
                            <hr>
                            <span class="pre"></span>
                            <hr>
                            <span class="evo"></span>
                            <hr>
                            <button class="btn"
                                onclick=PokeDeck.fillCard(this.closest(".card"),Utilities.randomPokemonNumber())>
                            <img src="./images/reload.png" style="width:40px;">
                            </button>
                            <button class="btn" onclick=PokeDeck.removeCard(this.closest(".card"))>
                            <img src="./images/delete.png" style="width:40px;">
                            </button>
                            <button class="CartButton btn" data-id="0" data-name="Pikachu"
                                data-img="Pika.png" onclick="PokeCart.addPokemon(this.dataset)"><img src="./images/starteam.png">
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            `
        //Rellena carta
        let cards = document.querySelectorAll('.card');
        await PokeDeck.fillCard(cards[cards.length - 1], pokemonId)
        document.querySelector(".addcard").disabled = false
    }

    static async removeCard(card) {
        card.remove()
    }

    static async loadTypes(card, tipos) {
        let logos = card.querySelector(".typeslogo")
        let txt = ""
        for (let t of tipos) {
            if (t == "water") {
                txt += `<img src="./images/tipos/water.png" style="width:3rem;"></img>`
            } else if (t == "bug") {
                txt += `<img src="./images/tipos/bug.png" style="width:3rem;"></img>`
            } else if (t == "dark") {
                txt += `<img src="./images/tipos/dark.png" style="width:3rem;"></img>`
            } else if (t == "dragon") {
                txt += `<img src="./images/tipos/dragon.png" style="width:3rem;"></img>`
            } else if (t == "electric") {
                txt += `<img src="./images/tipos/electric.png" style="width:3rem;"></img>`
            } else if (t == "fairy") {
                txt += `<img src="./images/tipos/fairy.png" style="width:3rem;"></img>`
            } else if (t == "fighting") {
                txt += `<img src="./images/tipos/fighting.png" style="width:3rem;"></img>`
            } else if (t == "fire") {
                txt += `<img src="./images/tipos/fire.png" style="width:3rem;"></img>`
            } else if (t == "flying") {
                txt += `<img src="./images/tipos/flying.png" style="width:3rem;"></img>`
            } else if (t == "ghost") {
                txt += `<img src="./images/tipos/ghost.png" style="width:3rem;"></img>`
            } else if (t == "grass") {
                txt += `<img src="./images/tipos/grass.png" style="width:3rem;"></img>`
            } else if (t == "ground") {
                txt += `<img src="./images/tipos/ground.png" style="width:3rem;"></img>`
            } else if (t == "ice") {
                txt += `<img src="./images/tipos/ice.png" style="width:3rem;"></img>`
            } else if (t == "normal") {
                txt += `<img src="./images/tipos/normal.png" style="width:3rem;"></img>`
            } else if (t == "poison") {
                txt += `<img src="./images/tipos/poison.png" style="width:3rem;"></img>`
            } else if (t == "psychic") {
                txt += `<img src="./images/tipos/psychic.png" style="width:3rem;"></img>`
            } else if (t == "rock") {
                txt += `<img src="./images/tipos/rock.png" style="width:3rem;"></img>`
            } else if (t == "steel") {
                txt += `<img src="./images/tipos/steel.png" style="width:3rem;"></img>`
            }
        }

        return logos.innerHTML = txt
    }
    static findColors() {
        let selectedcolor = document.getElementById("colorSelector").value
        console.log(selectedcolor)
        return selectedcolor
    }
    static async checkfiltercolor(selectedcolor) {
        let pokecolorselected
        if (selectedcolor != 0) {
            let urlcolor = "https://pokeapi.co/api/v2/pokemon-color/" + selectedcolor
            let pokemonDatacolor = await Utilities.pokeAPI(urlcolor)
            let indexrandom = Math.floor(Math.random() * pokemonDatacolor.pokemon_species.length)
            pokecolorselected = pokemonDatacolor.pokemon_species[indexrandom].url
            let pokeidselected = pokecolorselected.substring(42, pokecolorselected.length - 1)
            return pokeidselected
        }
    }
    static findType() {
        let selectedtype = document.getElementById("typeSelector").value
        return selectedtype
    }
    static async checkfiltertype(selectedtype) {
        let poketypeselected
        if (selectedtype != 0) {
            let urltype = "https://pokeapi.co/api/v2/type/" + selectedtype
            let pokemonDatatype = await Utilities.pokeAPI(urltype)

            let indexrandom = Math.floor(Math.random() * pokemonDatatype.pokemon.length)
            poketypeselected = pokemonDatatype.pokemon[indexrandom].pokemon.url

            let pokeidselected = poketypeselected.substring(34, poketypeselected.length - 1)
            return pokeidselected
        }

    }
    static checkFilters(){
        let selectedtype = document.getElementById("typeSelector").value
        let selectedcolor = document.getElementById("colorSelector").value
        if (selectedcolor!=0){
            return 1
            
        }else if(selectedtype!=0){
            return 2
        }else{
            return 3
        }
    }
    static reloadAllCards(){
        
    }
    static removeAllCards(){
                let deck = document.querySelector(".deck")
                //CARD
                deck.innerHTML =" "
    }
    static fillShiny(card){
        let img = card.querySelector("span img ")
        img.src = pokemonData.sprites.front_shiny;
    }
}
