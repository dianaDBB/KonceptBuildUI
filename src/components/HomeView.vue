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

      <div v-for="(section, index) in visibleSections" :key="index" class="menu-section">
        <h3 v-if="section.title" class="menu-section-title">
          <component :is="section.icon" :size="14" />
          {{ section.title }}
        </h3>

        <!-- Cards -->
        <div v-if="section.type === 'cards'" class="menu-grid">
          <RouterLink v-for="item in section.cards" :key="item.route" :to="item.route" class="menu-card">
            <div class="menu-card__header">
              <span>
                <component :is="item.icon" :size="24" />
              </span>

              <h3>{{ item.label }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </RouterLink>
        </div>

        <!-- Badges -->
        <div v-else-if="section.type === 'badges'" class="menu-badges">
          <RouterLink v-for="item in section.cards" :key="item.route" :to="item.route" class="menu-badge">
            <component :is="item.icon" :size="14" />
            {{ item.label }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Contact,
  Users,
  List,
  LayoutDashboard,
  ShoppingCart,
  Package,
  ClipboardClock,
  HandCoins,
  FileInput,
  FileCheck,
  FileText,
} from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const categories = [
  {
    id: 'works',
    label: 'OBRAS',
    sections: [
      {
        type: 'cards',
        cards: [
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
    ],
  },

  {
    id: 'purchases',
    label: 'COMPRAS',
    sections: [
      {
        type: 'cards',
        cards: [
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
    ],
  },

  {
    id: 'sales',
    label: 'VENDAS',
    sections: [
      {
        type: 'cards',
        cards: [
          {
            label: 'Dashboard',
            description: 'Recebimentos, Margens e Rentabilidade por Cliente',
            icon: LayoutDashboard,
            route: '/sales/dashboard',
          },
          {
            label: 'Clientes',
            description: 'Gerir dados dos clientes',
            icon: Users,
            route: '/sales/clients',
          },
          {
            label: 'Faturas e Notas de Crédito',
            description: 'Gerir faturas e notas de crédito dos clientes',
            icon: FileInput,
            route: '/sales/client-invoices',
          },
          {
            label: 'Pagamentos',
            description: 'Gerir pagamentos dos clientes',
            icon: FileCheck,
            route: '/sales/client-payments',
          },
        ],
      },
      {
        type: 'badges',
        title: 'Relatórios',
        icon: FileText,
        cards: [
          {
            label: 'Extrato Cliente por Vencimento',
            description: '',
            icon: LayoutDashboard,
            route: '/sales/client-report',
          },
        ],
      },
    ],
  },

  {
    id: 'hr',
    label: 'RECURSOS HUMANOS',
    sections: [
      {
        type: 'cards',
        cards: [
          {
            label: 'Dashboard',
            description: 'Relatório de custos',
            icon: LayoutDashboard,
            route: '/hr/dashboard',
          },
          {
            label: 'Colaboradores',
            description: 'Gerir dados dos colaboradores, custos e remunerações.',
            icon: Contact,
            route: '/hr/workers',
          },
          {
            label: 'Timesheet',
            description: 'Gerir timesheets.',
            icon: ClipboardClock,
            route: '/hr/timsheet',
          },
          {
            label: 'Salários',
            description: 'Gerir salários.',
            icon: HandCoins,
            route: '/hr/wages',
          },
        ],
      },
    ],
  },
];

const route = useRoute();

const selectedCategory = ref(categories.find((c) => c.id === route.query.tab) ?? categories[0]);

const visibleSections = computed(() => selectedCategory.value.sections);
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

.menu-section {
  &:not(:last-child) {
    margin-bottom: 36px;
  }
}

.menu-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 36px 0 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 14px;

  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);

  border-left: 4px solid var(--color-primary);
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

.menu-badges {
  display: flex;
  flex-wrap: wrap;

  gap: 12px;
  padding-left: 14px;
}

.menu-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 12px;

  background: var(--color-primary-light);
  color: var(--color-primary);

  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;

  &:hover {
    background: var(--color-primary);
    color: white;
  }
}
</style>
