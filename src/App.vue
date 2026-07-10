<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <h1>KonceptBuild</h1>
        <p>Building the future together</p>
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

<script setup lang="ts"></script>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
}

.header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border-light);
  padding: 28px 20px;
  text-align: center;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;

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

.main {
  flex: 1;
  padding: 32px 20px;
}

.container {
  max-width: 2000px;
  margin: 0 auto;
}

.footer {
  padding: 18px;
  text-align: center;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border-light);
  color: var(--color-text-muted);
  font-size: 12px;
}
</style>
