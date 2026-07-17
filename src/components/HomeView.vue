<template>
  <section class="home-page">
    <div class="modules">
      <div class="modules-tabs">
        <button
          v-for="category in categories"
          :key="category.id"
          class="module-tab"
          :class="{ active: selectedCategory.id === category.id }"
          @click="selectedCategory = category"
        >
          {{ category.label }}
        </button>
      </div>

      <div class="menu-grid">
        <RouterLink v-for="item in visibleItems" :key="item.route" :to="item.route" class="menu-card">
          <div class="menu-card__header">
            <span>
              <component :is="item.icon" :size="24" />
            </span>

            <h3>{{ item.label }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Contact, Users, List, LayoutDashboard, ShoppingCart, Package } from 'lucide-vue-next';
import { ref, computed } from 'vue';

const categories = [
  {
    id: 'works',
    label: 'OBRAS',
    items: [
      {
        label: 'Dashboard',
        description: 'Mock - Não faz nada ainda',
        icon: LayoutDashboard,
        route: '/works/dashboard',
      },
      {
        label: 'Obras',
        description: 'Gerir dados das obras.',
        icon: List,
        route: '/works/list',
      },
    ],
  },

  {
    id: 'purchases',
    label: 'COMPRAS',
    items: [
      {
        label: 'Dashboard',
        description: 'Mock - Não faz nada ainda',
        icon: Package,
        route: '/purchases/dashboard',
      },
      {
        label: 'Fornecedores',
        description: 'Mock - Não faz nada ainda',
        icon: ShoppingCart,
        route: '/purchases/list',
      },
    ],
  },

  {
    id: 'sales',
    label: 'VENDAS',
    items: [
      {
        label: 'Dashboard',
        description: 'Mock - Não faz nada ainda',
        icon: Package,
        route: '/sales/dashboard',
      },
      {
        label: 'Clientes',
        description: 'Gerir dados dos clientes',
        icon: Users,
        route: '/sales/clients',
      },
    ],
  },

  {
    id: 'hr',
    label: 'RECURSOS HUMANOS',
    items: [
      {
        label: 'Dashboard',
        description: 'Mock - Não faz nada ainda',
        icon: Package,
        route: '/hr/dashboard',
      },
      {
        label: 'Colaboradores',
        description: 'Gerir dados dos colaboradores, custos e remunerações.',
        icon: Contact,
        route: '/hr/workers',
      },
    ],
  },
];

const selectedCategory = ref(categories[0]);

const visibleItems = computed(() => selectedCategory.value.items);
</script>

<style>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/************************************************************************************************************ MODULES */

.modules {
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-card);

  h2 {
    margin: 0 0 8px;
    font-size: 28px;
    color: var(--color-text);
  }

  p {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.6;
  }
}

.modules-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 28px;
  border-bottom: 1px solid var(--color-border-light);
}

.module-tab {
  padding: 12px 20px;
  border: none;
  background: transparent;
  cursor: pointer;

  font-weight: 600;
  color: var(--color-text-muted);

  border-bottom: 3px solid transparent;
  transition: 0.2s;

  &:hover {
    color: var(--color-primary);
  }

  &.active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
  }
}

/************************************************************************************************************** MENUS */

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.menu-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
  align-items: flex-start;
  text-decoration: none;
  color: inherit;

  &:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-hover);
  }
}

.menu-card__header {
  display: grid;
  grid-template-columns: 52px 1fr;
  grid-template-rows: auto auto;
  column-gap: 16px;
  row-gap: 4px;
  align-items: center;

  h3 {
    grid-column: 2;
    color: var(--color-text);
    font-size: 18px;
    text-align: left;
    justify-self: start;
  }

  p {
    grid-column: 2;
    color: var(--color-text-muted);
    text-align: left;
    justify-self: start;
  }

  span {
    grid-row: 1 / span 2;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-primary-light);
    color: var(--color-primary);
    border-radius: 10px;
  }
}
</style>
