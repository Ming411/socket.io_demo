<template>
 <div>
     <h1>用户登录</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="username">用户名</label>
        <input v-model="user.username" type="text"  id="username">
      </div>
         <div>
        <label for="password">密码</label>
        <input v-model="user.password" type="text" id="password">
      </div>
         <div>
      <button>登录/注册</button>
      </div>
    </form>
 </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'LoginView',
  setup () {
    const router = useRouter()
    const store = useStore()
    const user = reactive({
      username: '',
      password: ''
    })
    const handleSubmit = async () => {
      try {
        const { data } = await axios.post('http://localhost:3000/api/login', user)
        // 注册并持久化token
        store.commit('setUser', data)
        router.push('/')
      } catch (e) {
        window.alert(e)
      }
    }
    return {
      user, handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped></style>
