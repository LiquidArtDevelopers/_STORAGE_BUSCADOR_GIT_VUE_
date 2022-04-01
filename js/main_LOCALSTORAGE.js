const API = "https://api.github.com/users/";


const app = Vue.createApp({
    data() {
        return {
            result: null,
            search : null, // asociado 
            error: null,
            favorites: new Map(),           
        };
    },
    created(){
        if (typeof(Storage) !== 'undefined') {
            // Código cuando Storage es compatible
            //COGEMOS DE STORAGE EL VALOR
            let guardado = localStorage.getItem('favs');
            if (guardado){
                console.log(guardado)
                let guardadoL=JSON.parse(guardado)
                const favorites = new Map(guardadoL.map(favorite => [favorite.id, favorite]))
                this.favorites = favorites         
            } else {
                guardado = '';
            }                
        } else {
            // Código cuando Storage NO es compatible
            document.getElementById("txt1").innerHTML = 'Este Navegador no soporta Storage';
        }         
    },
    computed:{
        isFavorite(){
            return this.favorites.has(this.result.id)
        },
        allFavorites(){
            return Array.from(this.favorites.values())
        } 
    },
    methods : {
        async doSearch() {
            this.result = this.error = null
            try {
                const response = await fetch(API + this.search)
                if (!response.ok) throw new Error("User not found")
                const data = await response.json()
                console.log(data);
                this.result = data // en result guardamos los datos
            } catch(error) {
              this.error = error
            } finally {
              this.search = null
            }
        },        
        addFavorite() {            
            this.favorites.set(this.result.id, this.result)      
            this.updateStorage()
        },
        removeFavorite(key) {
            this.favorites.delete(key)
            this.updateStorage()
        },
        /* showFavorite(favorite){
            this.result = favorite
        }, */
        updateStorage(){                                 
            localStorage.setItem('favs', JSON.stringify(this.allFavorites));            
        },
        
    },
    /* beforeMount(){
        this.deStorage()
     }, */
});


