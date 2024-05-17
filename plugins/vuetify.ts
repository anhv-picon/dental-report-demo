// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
	// @ts-ignore
	const vuetify = createVuetify({
		ssr: true,
		defaults,
		theme: {
			light,
			dark,
		}
	})
	app.vueApp.use(vuetify)
})
