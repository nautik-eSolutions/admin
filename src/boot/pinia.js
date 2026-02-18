import {defineBoot} from "#q-app/wrappers";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";


const pinia = createPinia();
export default defineBoot(({app})=>{
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia);
})
