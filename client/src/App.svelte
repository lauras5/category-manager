<script>
    import {onMount} from 'svelte';
    import {
        addCategorySet,
        listCategorySets,
        deleteCategorySet,
        getTopLevelCategories
    } from 'sql-arbitrary-category-system-fetch-utils';
    import CategorySet from "./CategorySet.svelte";
    import Icon from 'fa-svelte';
    import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';

    let sets = [];
    let selectedSet = null;
    let newSetName = '';

    async function getSets() {
        sets = await listCategorySets();
    }

    onMount(async () => {
        await getSets();
        selectedSet = sets[0] || null;
    });


    async function addHandler() {
        if (!newSetName) return;
        await addCategorySet(newSetName);
        await getSets();
        selectedSet = sets[sets.length - 1];
        newSetName = '';
    }


    let topCategories = [];
    $: {
        if (selectedSet) {
            (async () => {
                try {
                    topCategories = await getTopLevelCategories(selectedSet);
                } catch (err) {
                    console.error(err);
                }
            })()
        }
    }

    async function handleDelete(id) {
        await deleteCategorySet(id);
        await getSets();
        selectedSet = sets[0] || null;
    }
</script>

<div>
    <input placeholder="New Set Name" bind:value={newSetName}>
    <button on:click={addHandler}>Add Set</button>
</div>

<div>
    {#each sets as set}
        <ul class="list-none ml-2 pt-1 pl-2 border-l border-gray-100">
            <li class="pt-1 pb-1">
                <span on:click={() => handleDelete(set.id)} class="cursor-default relative text-red-500 font-extralight">
                    <Icon icon={faTimes}></Icon>
                </span>
                <CategorySet {...set}/>
            </li>
        </ul>
    {/each}
</div>
