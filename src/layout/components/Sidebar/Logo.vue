<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }} <i title="切换组织" class="el-icon-d-arrow-right" /></h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <el-dropdown>
          <h1 class="sidebar-title">{{ title }} <i title="切换组织" class="el-icon-d-arrow-right" /></h1>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="organization in organizations" :key="organization.id" :value="organization.url">
              <a :href="organization.url">{{ organization.name }}</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </router-link>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    },
    organizations: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 该处为标题和logo展示地址 迁移属性用于组件创建时加载配置
      title: 'Structure Admin',
      logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png'
    }
  },
  created() {
    if (sessionStorage.getItem('title')) {
      this.title = sessionStorage.getItem('title')
    }
    if (sessionStorage.getItem('logo')) {
      this.logo = sessionStorage.getItem('logo')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-tenant{

}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
