
class Utilities {
    static randomPokemonNumber() {
        return (Math.floor(Math.random() * 1025) + 1)
    }
    static async pokeAPI(url) {
        const response = await fetch(url)
        if (!response.ok) {
            // BAD
            console.error('ERROR fetching data');
        } else {
            // GOOD
            return await response.json();
        }
    }
    static buildpoketable() {
        this.poketabla = [
            { /*
                nombre:"pikachu",
                id:3,
                colorid:3,
                type1id:3
                type2id:4
           // */      
            }
        ]
    }
    static async addCardButton(){
        let answer=PokeDeck.checkFilters()
                if(answer==1){
                    let sc= PokeDeck.findColors()
                    let pkID= await PokeDeck.checkfiltercolor(sc)
                    PokeDeck.addCard(pkID)
                }else if(answer==2){
                    let sc= PokeDeck.findType()
                    let pkID= await PokeDeck.checkfiltertype(sc)
                    PokeDeck.addCard(pkID)
                }else{
                    PokeDeck.addCard()
                }
    }
}