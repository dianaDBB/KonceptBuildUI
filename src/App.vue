<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <div>
          <h1>KonceptBuild</h1>
          <p>Building the future together</p>
        </div>
        <button v-if="showLogout" class="logout-button" @click="logout">Log out</button>
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
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api';

const route = useRoute();
const router = useRouter();
const showLogout = computed(() => route.name !== 'login' && api.isAuthenticated());

async function logout(): Promise<void> {
  try {
    await api.logout();
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

.logout-button {
  position: absolute;
  right: 0;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text-secondary);
  cursor: pointer;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
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
