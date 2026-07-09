<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <h1>KonceptBuild</h1>
        <p>Building the future together</p>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <div>
          <nav class="tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="tab-btn"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </nav>

          <!-- Workers -->
          <section v-if="activeTab === 'workers'" class="tab-body">
            <WorkersView />
          </section>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <p>&copy; 2026 Budget. Process your bank statements with ease.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import WorkersView from '@/components/WorkersView.vue';

const tabs = [{ id: 'workers', label: 'Workers' }];

const activeTab = ref('workers');

onMounted(async () => {});
</script>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 20px;
  text-align: center;

  .header-content {
    max-width: 800px;
    margin: 0 auto;

    h1 {
      margin: 0;
      font-size: 70px;
      font-weight: 700;
      margin-bottom: 8px;
      display: 'inline';
    }

    p {
      margin: 0;
      font-size: 16px;
      opacity: 0.95;
    }
  }
}

.app-main {
  flex: 1;
  padding: 40px 20px;

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
}

.tabs {
  display: flex;
  gap: 4px;
  background: white;
  border-radius: 12px 12px 0 0;
  padding: 8px 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 0;
  overflow-x: auto;
}

.tab-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px 8px 0 0;
  background: transparent;
  color: #6b7280;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;

  &:hover:not(.active) {
    background: #f3f4f6;
    color: #6b7280;
  }

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom-color: transparent;
  }
}

.tab-body {
  margin-bottom: 40px;
  background: white;
  border-radius: 0 0px 12px 12px;
  padding: 0px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.app-footer {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 13px;

  p {
    margin: 0;
  }
}
</style>
