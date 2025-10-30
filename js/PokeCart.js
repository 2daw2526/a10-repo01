class PokeCart {
    constructor() {
        this.items = []
    }
    static loadStorage() {
        //carga el carrito del localStorage
        this.items = JSON.parse(localStorage.getItem('PokeKart')) || []
        this.display()
    }
    static saveStorage() {
        //guarda el carrito en el local storage
        localStorage.setItem("PokeKart", JSON.stringify(this.items))
    }

    static addPokemon(data) {
        //buscamos el id en el array
        //si existe en el carrito añadimos uno mas
        //si no existe lo añade
        if (!this.items) {
            this.items = []
        }

        let existe = this.items.findIndex((item) => item.id == data.id)
        //Si no existe devuelve -1, Si existe devuelve la posicion del array donde está
        if (existe != -1) {
            this.items[existe].quantity++

        } else {
            this.items.push(
                {
                    id: data.id,
                    name: data.name,
                    img: data.img,
                    quantity: 1
                }

            )
        }
        this.saveStorage()
        this.display()
        console.log("has metido a " + data.name)
    }
    static getQuantity(id) {
        //devuelve la cantidad de elementos
    }
    static setCount(id, newQuantity) {
        //busca el elemento con el ID y el asigna el new Quantity
    }
    static addQuantity(id) {
        let posicion = this.items.findIndex((item) => item.id == id)
        console.log(posicion)
        this.items[posicion].quantity++
        console.log(this.items[posicion].quantity)
        this.saveStorage()
        this.display()


    }
    static restarQuantity(id) {
        let posicion = this.items.findIndex((item) => item.id == id)
        if (this.items[posicion].quantity == 1) {
            this.removePokemon(id)
        } else {
            this.items[posicion].quantity--
            this.saveStorage()
            this.display()
        }

    }
    static removePokemon(id) {
        //borra el pokemon del carrito
        console.log("Borrando " + id)
        //1.Localizar la posicion en el array donde está el pokemon que queremos borrar
        let posicion = this.items.findIndex((item) => item.id == id)

        //2.Borrar el elemento
        this.items.splice(posicion, 1)
        this.display()
        this.saveStorage()
    }
    static removeAll() {
        console.log('hola')
        localStorage.clear()
        this.items = []
        PokeCart.display()


        //borra todo
    }
    static display(elementDom) {
        let carrito = document.querySelector('#carrito')
        carrito.innerHTML = ""
        for (let item of this.items) {
            carrito.innerHTML += `
                <div class="d-block shadow align-content-center ">
                <h6 class="nombrecarrito mayus">${item.name}</h6>
                <div class="d-flex align-items-center ms-5">
                <button class="btn btn-dark ms-1" onclick="PokeCart.restarQuantity(${item.id})">-</button>
                <img src="${item.img}" class="ms-2" onclick="PokeDeck.addCard(${item.id})">
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-dark ms-3" onclick="PokeCart.addQuantity(${item.id})">+</button>
                <button class="btn borrarpkcart ms-2" onclick="PokeCart.removePokemon(${item.id})">
                <img src="./images/delete.png" style="width:30px; display: inline-block;">
                </button>
                </div>
                </div>
            `
        }
        carrito.innerHTML +=
            `
            <span></span>
    <button class="btn btn-dark d-block position-absolute bottom-0 end-0 m-3" onclick="PokeCart.removeAll()">Remove All</button>
        `
    }
}