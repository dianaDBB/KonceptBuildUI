<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <div>
          <h1>KonceptBuild</h1>
          <p>Building the future together</p>
        </div>
      </div>
      <div v-if="showLogout" ref="profileMenu" class="profile-menu">
        <button
          class="profile-trigger"
          type="button"
          aria-haspopup="menu"
          :aria-expanded="isProfileMenuOpen"
          aria-label="Open account menu"
          @click="isProfileMenuOpen = !isProfileMenuOpen"
        >
          <span class="profile-avatar"><User2Icon :size="16" /></span>
        </button>

        <div v-if="isProfileMenuOpen" class="profile-dropdown" role="menu">
          <div class="profile-details">
            <div>
              <strong>{{ username }}</strong>
              <span>Signed in</span>
            </div>
          </div>
          <div class="profile-divider"></div>
          <button type="button" role="menuitem" @click="logout">
            <LogOut :size="16" />
            Log out
          </button>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <footer class="footer">
      <p>&copy; 2026 KonceptBuild</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LogOut, User2Icon } from 'lucide-vue-next';
import authApi from '@/services/auth-api';

const route = useRoute();
const router = useRouter();

const showLogout = computed(() => route.name !== 'login' && authApi.isAuthenticated());

const username = computed(() => authApi.getUsername());
let interval: number;

const isProfileMenuOpen = ref(false);
const profileMenu = ref<HTMLElement | null>(null);

onBeforeUnmount(() => {
  document.removeEventListener('click', closeProfileMenuButton);
  document.removeEventListener('keydown', closeProfileMenuEscape);
});

onMounted(() => {
  authApi.checkAuthentication();

  interval = window.setInterval(() => {
    authApi.checkAuthentication();
  }, 30000); // 30 seconds

  document.addEventListener('click', closeProfileMenuButton);
  document.addEventListener('keydown', closeProfileMenuEscape);
});

onUnmounted(() => {
  clearInterval(interval);
});

function closeProfileMenuButton(event: MouseEvent): void {
  if (!profileMenu.value?.contains(event.target as Node)) {
    isProfileMenuOpen.value = false;
  }
}

function closeProfileMenuEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    isProfileMenuOpen.value = false;
  }
}

async function logout(): Promise<void> {
  isProfileMenuOpen.value = false;

  try {
    await authApi.logout();
  } finally {
    await router.replace({ name: 'login' });
  }
}
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
}

.header {
  position: relative;
  background: var(--color-main-background);
  border-bottom: 1px solid var(--color-border-light);
  padding: 28px 20px;
  text-align: center;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  h1 {
    margin: 0 0 6px;
    font-size: 50px;
    font-weight: 700;
    color: var(--color-text);
  }

  p {
    margin: 0;
    font-size: 15px;
    color: var(--color-text-muted);
  }
}

.profile-menu {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
}

.profile-trigger {
  display: inline-flex;
  align-items: center;
  padding: 3px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: 0.2s;
}

.profile-avatar {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.profile-dropdown {
  position: absolute;
  z-index: 10;
  top: calc(100% + 10px);
  right: 0;
  width: 180px;
  padding: 8px;
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  background: var(--color-background);
  box-shadow: var(--shadow);
  text-align: left;
}

.profile-details {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;

  strong,
  span:not(.profile-avatar) {
    display: block;
  }

  strong {
    color: var(--color-text);
    font-size: 16px;
  }

  span:not(.profile-avatar) {
    margin-top: 3px;
    color: var(--color-text-muted);
    font-size: 12px;
  }
}

.profile-divider {
  height: 1px;
  margin: 4px 0;
  background: var(--color-border-light);
}

.profile-dropdown button {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 9px;
  padding: 9px 8px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--color-danger);
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: var(--color-danger-bg);
  }
}

.main {
  flex: 1;
  padding: 32px 20px;
  overflow: hidden;
  min-height: 0;
}

.container {
  max-width: 2000px;
  margin: 0 auto;

  height: 100%;
  min-height: 0;
}

.footer {
  padding: 18px;
  text-align: center;
  background: var(--color-main-background);
  border-top: 1px solid var(--color-border-light);
  color: var(--color-text-muted);
  font-size: 12px;
}
</style>
