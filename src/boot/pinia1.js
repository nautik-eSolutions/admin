import {defineBoot} from "#q-app/wrappers";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";


const pinia1 = createPinia();
export default defineBoot(({app})=>{
  pinia1.use(piniaPluginPersistedstate)
  app.use(pinia1);
})
