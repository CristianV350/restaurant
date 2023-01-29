<template>
    <div id="plans">
        <h2>Menu</h2>
        <div id="menu-list">
            <dataTable
                    @modal="toggleModal"
                    :loading="loading"
                    :key="menuRows"
                    @addAction="menuStore.addMenu"
                    @updateAction="menuStore.updateMenu"
                    @category="menuStore.setActiveMenu"
                    @categories="() => {}"
                    @selecting="select"
                    @fetchItems="fetchMenus"
                    :item-id="menu"
                    :model="modelMenus"
                    :data="menuRows">
            </dataTable>
        </div>
    </div>

    <div id="ingredients">
        <h2>Menu Foods</h2>
        <div id="food-list" v-if="menuRows.length" >
            <dataTable @modal="toggleModal" :loading="loading" :key="menuItemRows"
                       @addAction="'setMenuItem'"
                       @updateAction="'updateMenuItem'"
                       @fetchItems="fetchMenuItems"
                       :item-id="menu"
                       :food="item"
                       :model="modelMenuItems"
                       :data="menuItemRows"
                       :no-row="false">
            </dataTable>

            <modal @fetchItems="fetchMenuItems()" @modal="toggleModal" :itemId="menu" :type="'menu'"
                   :data="modalMenuItems" :menu="itemName"
                   :dialog="modal"></modal>
        </div>
    </div>
    <el-button class="export container text-center" size="large" type="primary" @click="exportFile('ingredients')">Export Ingredients
    </el-button>
    <el-button class="export container text-center" size="large" type="primary" @click="exportFile('calculation')">Export calculator
    </el-button>
    <el-button class="export container text-center" size="large" type="primary" @click="exportFile('menu')">Export menu
    </el-button>
</template>

<script>
    import {defineComponent, ref, computed, watch} from 'vue';
    import { useMenuStore } from '../store/menu'
    import { useCalculationStore } from '../store/calculation'
    import { storeToRefs } from 'pinia'
    import dataTable from '../components/dataTable.vue';
    import modal from '../components/modal.vue';

    const modelMenuItems = {
        food_id: 0,
        menu_id: 0,
        type: 'food'
    }

    const modelMenus = {
        name: '',
        type: 'menu',
        date: '',
        edited: false
    };

    export default defineComponent({
        components: {dataTable, modal},
        setup() {
            const menuStore = useMenuStore()
            const calculationStore = useCalculationStore()
            const modal = ref(false);
            const loading = ref(false);

            let menuRows = ref([]);
            const { menus } = storeToRefs(menuStore);
            const menu = computed(() => menuStore.activeMenu)
            const menuList = ref([]);

            const fetchMenus = async () => {
                loading.value = true;
                await menuStore.fetchMenus()
                menuRows.value = menus.value.map(menu => {
                    return {
                        id: menu.id || null,
                        name: menu.name || '',
                        type: 'menu',
                        date: menu.date || '',
                        created: true,
                    }
                });
                loading.value = false;
            };


            (async () => {
                await fetchMenus()
                await fetchMenuItems()
                await calculationStore.fetchGroups()
            })()

            const setMenu = (val) => {
                menu.value = val;
            };
            const setMenus = (val) => {
                if(menuList.value.length) {
                    if(menuList.value.find(i => i === val)) menuList.value = menuList.value.filter(i => i !== val);
                    else menuList.value.push(val);
                }else{
                   menuList.value.push(val);
                }
            }

            //Items
            const foods = computed(() => calculationStore.foods);
            const groups = computed(() => calculationStore.groups);

            const modalMenuItems = computed(() => groups.value.map((item) => {
                return {
                    children: item.foods.map((elem) => {
                        return {
                            key: elem.id,
                            name: elem.name,
                            menu_id: elem.menu_id,
                            group_id: elem.group_id,
                            price_portion: elem.price_portion,
                            portions: elem.portions
                        }
                    }),
                    disabled: false,
                    key: item.id,
                    name: item.name
                }
            }));

            let menuItemRows = ref([])
            const item = computed(() => null);
            const itemName = computed(() => null);

            const fetchMenuItems = async () => {
                loading.value = true;
                menuItemRows.value = await menuStore.fetchMenuItems()
                loading.value = false;
            };

            const toggleModal = (v) => {
                modal.value = v
            };

            const exportFile = (type) => {
                let data = {type: type, menu_id: menu.value};
                if(selecting.value) data = {type: type, menu_id: menuList.value};
                axios.post('/api/export', data,{
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/pdf'
                    }
                }).then((r) => {
                     downloadFile(r.data,type)
                })
            };

            const setLoading = (v) => {
                loading.value = v;
            };
            const downloadFile = (response,type) => {
                try {
                    var file = new File([response], filename, {type: "text/plain"});
                } catch (e) {
                    file = new Blob([response], {type: "text/plain"});
                }
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(file);
                link.download = type + '.pdf';
                link.click()
            };

            const selecting = ref(false);
            const select = (v) => {
                selecting.value = v;
            }

            return {
                modelMenus,
                modalMenuItems,
                menuRows,
                menu,
                menus,
                groups,
                foods,
                modal,
                menuItemRows,
                modelMenuItems,
                menuList,
                item,
                itemName,
                selecting,
                menuStore,
                loading,
                setMenu,
                toggleModal,
                fetchMenus,
                fetchMenuItems,
                exportFile,
                setLoading,
                setMenus,
                select
            }
        }
    })
</script>

<style scoped>

</style>
