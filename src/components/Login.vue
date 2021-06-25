<template>
    <div>

    </div>
</template>
<script>
import {auth} from "@/utils/firebase.js"
export default {
    setup() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                var uid = user.uid;
                console.log(uid)
                // ...
            } else {
                console.log("No autenticado")
            }
        });
    },
}
</script>
<style scoped>

</style>