<template>
  <div class="basic-layout" v-cloak>
    <div :class="['side-wrapper', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统LOGO -->
      <div class="logo">
        <img src="../assets/image/logo.svg" alt="logo">
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="defaultMenu"
        router
        background-color="#001529"
        text-color="#fff"
        :collapse="isCollapse"
        class="side-menu">
          <tree-menu :userMenu="userMenu" />
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="handleToggle"><i :class="!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i></div>
          <div class="bread">
             <bread-crumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge :is-dot="noticeCount > 0" :class="{'notice': true, 'actived':  noticeCount> 0}" type="danger" @click="handleClick">
            <i class=el-icon-bell></i>
          </el-badge>
          <el-dropdown @command="handleCommand">
            <span class="user-link">
              {{userInfo.userName}}
              <i class="el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱: {{userInfo.userEmail}}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view ></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import TreeMenu from '@/components/TreeMenu.vue'
import BreadCrumb from '@/components/BreadCrumb.vue'

export default {
  name: 'base-layout',
  components: {
    TreeMenu,
    BreadCrumb
  },
  computed: {
    noticeCount() {
      return this.$store.state.noticeCount
    }
  },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      isCollapse: false,
      userMenu: [],
      defaultMenu: location.hash.slice(1)
    }
  },
  mounted() {
    this.getNoticeCount()
    this.getMenuList()
  },
  methods: {
    handleClick() {
      if (noticeCount) {
        this.$router.push('/audit/approve')
      }
    },
    handleCommand(val) {
      if (val === 'email') return
      this.$store.commit('saveUserInfo', '')
      this.userInfo = {}
      this.$router.push('/login')
    },
    handleToggle() {
      this.isCollapse = !this.isCollapse
    },
    async getNoticeCount() {
      try {
        const count = await this.$api.getNoticeCount()
        this.$store.commit('saveNoticeCount', count)
      } catch (error) {
        console.error(error)
      }
    },
    async getMenuList() {
      try {
        const { menuList, actionList } = await this.$api.getPermissionList()
        this.userMenu = menuList
        this.$store.commit('saveUserMenu', menuList)
        this.$store.commit('saveUserAction', actionList)
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .side-wrapper {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    overflow-x: hidden;
    transition: width .28s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        width: 32px;
        height: 32px;
        margin: 0 16px;
      }
    }
    .side-menu {
      /* Mark */
      height: calc(100vh - 50px); 
      border-right: none;
    }
    /* 导航合并 */
    &.fold {
      width: 64px;
    }
     /* 导航展开 */
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
          cursor: pointer;
        }
      }
      .user-info {
        .notice {
          line-height: 30px;
          margin-right: 15px;
        }
        .actived {
           cursor: pointer;
        }
        .user-link {
          cursor: pointer;
          color: #409eff
        }
      }
    }
    .wrapper {
      background-color: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
    }
    transition: margin-left .28s;
    /* 内容区域合并 */
    &.fold {
      margin-left: 64px;
    }
     /* 内容区域合并 */
    &.unfold {
      margin-left: 200px;
    }
  }
}
</style>