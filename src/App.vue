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
        <section v-if="activeView === 'home'" class="home-page">
          <div class="section-heading">
            <h2>Human Resources</h2>

            <div class="menu-grid">
              <button v-for="item in menuItems" :key="item.id" class="menu-card" @click="openSection(item.id)">
                <div class="menu-card__header">
                  <span class="menu-card__icon">{{ item.icon }}</span>
                  <h3>{{ item.label }}</h3>
                </div>

                <p>{{ item.description }}</p>
              </button>
            </div>
          </div>
        </section>

        <section v-else class="content-page">
          <div class="page-nav">
            <button class="back-btn" @click="activeView = 'home'">⬅ Back to home</button>
          </div>

          <section v-if="activeView === 'workers'" class="tab-body">
            <WorkersView />
          </section>
        </section>
      </div>
    </main>

    <footer class="app-footer">
      <p>&copy; 2026 KonceptBuild</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import WorkersView from '@/components/WorkersView.vue';

type View = 'home' | 'workers';

const menuItems = [
  {
    id: 'workers' as const,
    label: 'Workers',
    description: 'Manage worker details, rates, and salary information.',
    icon: '👥',
  },
  {
    id: 'example' as const,
    label: 'Example',
    description: 'This is another menu.',
    icon: '👥',
  },
];

const activeView = ref<View>('home');

function openSection(view: Exclude<View, 'home'>): void {
  activeView.value = view;
}
</script>

<style scoped lang="scss"></style>
