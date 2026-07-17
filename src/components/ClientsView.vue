<template>
  <div class="main-section">
    <div class="section-header">
      <span><Users :size="24" /></span>
      <h3>Clientes</h3>

      <div class="page-nav">
        <RouterLink to="/" class="link">Página Inicial</RouterLink>
      </div>
    </div>

    <div class="section">
      <div class="section-body">
        <div class="table">
          <table>
            <colgroup>
              <!-- code -->
              <col style="width: 90px" />
              <!-- name -->
              <col style="width: 150px" />
              <!-- address -->
              <col style="width: 150px" />
              <!-- postalCode -->
              <col style="width: 95px" />
              <!-- city -->
              <col style="width: 95px" />
              <!-- district -->
              <col style="width: 95px" />
              <!-- nif -->
              <col style="width: 95px" />
              <!-- contact -->
              <col style="width: 150px" />
              <!-- email -->
              <col style="width: 150px" />
              <!-- phone -->
              <col style="width: 140px" />
              <!-- status -->
              <col style="width: 90px" />
              <!-- note -->
              <col style="width: 100px" />
              <!-- ACTIONS -->
              <col style="width: 50px" />
            </colgroup>
            <thead>
              <tr>
                <th v-for="config in Object.values(Client.configs)" :key="config.label">
                  <div class="column-heading">
                    {{ config.label }}

                    <TableColumnFilter
                      :config="config"
                      :filters="clientFilters"
                      :sort-by="clientFilters.sortBy"
                      :sort-direction="clientFilters.sortDirection"
                      :disabled="isEditing"
                      @sort="setSort"
                      @apply="applyFilterValues"
                      @clear="clearFilterValues"
                    />
                  </div>
                </th>
                <th>
                  <button
                    v-if="hasActiveTableControls"
                    class="clear-table-controls"
                    :disabled="isEditing || apiStatus.isLoading"
                    title="Limpar todos os filtros e ordenação"
                    aria-label="Limpar todos os filtros e ordenação"
                    @click="clearAllTableControls"
                  >
                    <FunnelX :size="16" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody ref="tableBody">
              <tr
                v-for="row in clients"
                :key="row._key"
                :class="{ disabled: !clientIsActive(row) }"
                @dblclick="startEditClient(row)"
              >
                <!-- CODE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.client.code"
                      type="text"
                      :disabled="Client.configs.code.showDisabled(row.client)"
                      :class="{ required: Client.configs.code.isInvalid(row.client) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.client.code }}
                  </template>
                </td>

                <!-- COMPANY NAME -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.client.companyName"
                      type="text"
                      :disabled="Client.configs.companyName.showDisabled(row.client)"
                      :class="{ required: Client.configs.companyName.isInvalid(row.client) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.client.companyName }}
                  </template>
                </td>

                <!-- ADDRESS -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.client.address"
                      type="text"
                      :disabled="Client.configs.address.showDisabled(row.client)"
                      :class="{ required: Client.configs.address.isInvalid(row.client) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.client.address }}
                  </template>
                </td>

                <!-- POSTAL CODE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.client.postalCode"
                      type="text"
                      :disabled="Client.configs.postalCode.showDisabled(row.client)"
                      :class="{ required: Client.configs.postalCode.isInvalid(row.client) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.client.postalCode }}
                  </template>
                </td>

                <!-- CITY -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.client.city"
                      type="text"
                      :disabled="Client.configs.city.showDisabled(row.client)"
                      :class="{ required: Client.configs.city.isInvalid(row.client) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.client.city }}
                  </template>
                </td>

                <!-- DISTRICT -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.client.district"
                      type="text"
                      :disabled="Client.configs.district.showDisabled(row.client)"
                      :class="{ required: Client.configs.district.isInvalid(row.client) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.client.district }}
                  </template>
                </td>

                <!-- NIF -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.client.nif"
                      type="text"
                      :disabled="Client.configs.nif.showDisabled(row.client)"
                      :class="{ required: Client.configs.nif.isInvalid(row.client) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.client.nif }}
                  </template>
                </td>

                <!-- CONTACT -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.client.contact"
                      type="text"
                      :disabled="Client.configs.contact.showDisabled(row.client)"
                      :class="{ required: Client.configs.contact.isInvalid(row.client) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.client.contact }}
                  </template>
                </td>

                <!-- EMAIL -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.client.email"
                      type="email"
                      :disabled="Client.configs.email.showDisabled(row.client)"
                      :class="{ required: Client.configs.email.isInvalid(row.client) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.client.email }}
                  </template>
                </td>

                <!-- PHONE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <div class="phone-input">
                      <input
                        v-model="row.client.phoneCountryCode"
                        inputmode="text"
                        pattern="[0-9]{9}"
                        maxlength="4"
                        placeholder="+351"
                        :disabled="Client.configs.phone.showDisabled(row.client)"
                        :class="{ required: Client.configs.phone.isInvalid(row.client) }"
                        class="country-code"
                      />
                      <input
                        v-model="row.client.phone"
                        type="tel"
                        inputmode="numeric"
                        pattern="[0-9]{9}"
                        maxlength="9"
                        :disabled="Client.configs.phone.showDisabled(row.client)"
                        :class="{ required: Client.configs.phone.isInvalid(row.client) }"
                        class="phone-number"
                      />
                    </div>
                  </template>
                  <template v-else>
                    {{ `${row.client.phoneCountryCode} ${row.client.phone}` }}
                  </template>
                </td>

                <!-- STATUS -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <select
                      v-model="row.client.status"
                      :disabled="Client.configs.status.showDisabled(row.client)"
                      :class="{ required: Client.configs.status.isInvalid(row.client) }"
                    >
                      <option v-for="option in Client.configs.status.options" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    {{ Status.getLabel(row.client.status) }}
                  </template>
                </td>

                <!-- NOTE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.client.note"
                      type="text"
                      :disabled="Client.configs.note.showDisabled(row.client)"
                      :class="{ required: Client.configs.note.isInvalid(row.client) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.client.note }}
                  </template>
                </td>

                <!-- ACTIONS -->
                <td>
                  <div v-if="!rowHasChanges(row)" class="action-buttons">
                    <button :disabled="isEditing" @click="askDelete(row)"><Trash2 :size="16" /></button>
                    <button :disabled="isEditing" @click="startEditClient(row)">
                      <Pencil :size="16" />
                    </button>
                  </div>
                  <div v-if="rowHasChanges(row)" class="action-buttons editing">
                    <button @click="discardRow(row)"><Undo2 :size="16" /></button>
                    <button :disabled="!isRowValid(row)" @click="saveClient(row)">
                      <Check :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="apiStatus.isLoading" class="table-loading-overlay">
            <div>
              <LoaderCircle :size="18" class="spinner" />
              A carregar clientes...
            </div>
          </div>
        </div>

        <div class="actions">
          <button :disabled="isEditing || apiStatus.isLoading" @click="addClient">
            <Plus :size="18" /> Adicionar Cliente
          </button>
        </div>

        <Toast
          v-if="apiStatus.message"
          :message="apiStatus.message"
          :type="apiStatus.isSuccess ? 'success' : 'error'"
        />
      </div>
    </div>
  </div>

  <!-- delete dialog-->
  <ConfirmDialog
    v-model="showDeleteDialog"
    title="Eliminar cliente"
    :message="`Tem a certeza que quer eliminar definitivamente o cliente '${clientToDelete?.client.companyName}' com o NIF ${clientToDelete?.client.nif}?`"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { ApiResponseStatus } from '@/types/api-response-status';
import { Users, Pencil, Trash2, Check, Undo2, Plus, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';
import { SortDirection } from '@/types/sort-direction';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import ConfirmDialog from '@/composables/ConfirmDialog.vue';
import axios from 'axios';
import { Status } from '@/types/status';
import { ClientType, ClientFilters, ClientSortField } from '@/types/client-type';
import clientApi from '@/services/client-api';
import { Client } from '@/entities/client';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const tableBody = ref<HTMLTableSectionElement | null>(null);

/******************************************************************************************************** ROW ACTIONS */

interface ClientRow {
  client: ClientType;
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _original?: ClientType;
}

const clients = ref<ClientRow[]>([]);
const isEditing = computed(() => clients.value.some((row) => row._isNew || row._isEdited));
let _keyCounter = 0;

function nextKey(): string {
  return `row-${++_keyCounter}`;
}

function rowHasChanges(row: ClientRow) {
  return row._isNew || row._isEdited;
}

function discardRow(row: ClientRow) {
  if (row._isNew) {
    clients.value = clients.value.filter((w) => w._key !== row._key);
  } else {
    row.client = row._original!;
    row._isNew = false;
    row._isEdited = false;
  }
}

function isRowValid(row: ClientRow) {
  return (
    row.client.companyName?.trim() &&
    row.client.nif?.trim() &&
    row.client.contact?.trim() &&
    row.client.email?.trim() &&
    row.client.phone &&
    row.client.status?.trim()
  );
}

function clientIsActive(row: ClientRow) {
  return row.client.status == Status.ACTIVE;
}

/**************************************************************************************************************** GET */

async function fetchClients() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotClients = await clientApi.searchClients(clientFilters.value);

    clients.value = gotClients.map((client) => ({
      client: { ...client },
      _key: client.code ?? nextKey(),
      _isNew: false,
      _isEdited: false,
      _isDeleted: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Could not load clients.',
    };
  }
}

/*************************************************************************************************************** EDIT */

function startEditClient(row: ClientRow) {
  row._isEdited = true;

  row._original = structuredClone({ ...row.client });
}

/**************************************************************************************************************** ADD */

async function addClient(): Promise<void> {
  clients.value.push({
    client: {
      status: Status.ACTIVE,
      phoneCountryCode: '+351',
    },
    _key: nextKey(),
    _isNew: true,
    _isEdited: false,
  });

  await nextTick();

  const lastRow = tableBody.value?.querySelector('tr:last-child');
  lastRow?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
  });

  (lastRow?.querySelector('input') as HTMLInputElement)?.focus();
}

/*************************************************************************************************************** SAVE */

async function saveClient(row: ClientRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (row._isNew) {
      await clientApi.addClient(row.client);
    }

    if (row._isEdited) {
      await clientApi.editClient(row.client);
    }

    await fetchClients();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client saved successfully.',
    };
  } catch (error: unknown) {
    let message = 'Failed to save client.';

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: message,
    };
  }
}

/************************************************************************************************************* DELETE */

const showDeleteDialog = ref(false);
const clientToDelete = ref<ClientRow | null>(null);

function askDelete(row: ClientRow) {
  clientToDelete.value = row;
  showDeleteDialog.value = true;
}

async function confirmDelete(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (!clientToDelete.value?.client.id) {
      return;
    }

    await clientApi.deleteClient(clientToDelete.value.client.id);
    await fetchClients();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client deleted successfully.',
    };

    showDeleteDialog.value = false;
    clientToDelete.value = null;
  } catch (error: unknown) {
    let message = 'Failed to delete client.';

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: message,
    };
  }
}

/************************************************************************************************************ FILTERS */

const clientFilters = ref<ClientFilters>({});

const hasActiveTableControls = computed(() =>
  Object.values(clientFilters.value).some((value) => value !== undefined && value !== null && value !== ''),
);

function setSort(event: { column: ClientSortField; direction: SortDirection | undefined }): void {
  clientFilters.value = {
    ...clientFilters.value,
    sortBy: event.direction ? event.column : undefined,
    sortDirection: event.direction,
  };

  fetchClients();
}

function applyFilterValues(values: Record<string, unknown>): void {
  clientFilters.value = { ...clientFilters.value, ...(values as Partial<ClientFilters>) };

  fetchClients();
}

function clearFilterValues(values: Record<string, unknown>): void {
  clientFilters.value = { ...clientFilters.value, ...(values as Partial<ClientFilters>) };

  fetchClients();
}

function clearAllTableControls(): void {
  clientFilters.value = {};

  void fetchClients();
}

onMounted(fetchClients);
</script>
<style scoped lang="scss">
.phone-input {
  display: flex;
}

.country-code {
  width: 40px;
  border-right: none;
  border-radius: 4px 0 0 4px;
}

.phone-number {
  border-radius: 0 4px 4px 0;
}
</style>
