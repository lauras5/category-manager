<script>
    import {onMount} from 'svelte';
    import {
        addCategorySet,
        listCategorySets,
        deleteCategorySet,
        getTopLevelCategories
    } from 'sql-arbitrary-category-system-fetch-utils';
    import CategorySet from "./CategorySet.svelte";

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
        <ul>
            <li>
                <span on:click={() => handleDelete(set.id)} class="delete">✖</span>
                <CategorySet {...set}/>
            </li>
        </ul>
    {/each}
</div>


<style>
    .delete {
        cursor: default;
        font-weight: 200;
        position: relative;
        color: red;
    }

    ul {
        padding: 0.2em 0 0 0.5em;
        margin: 0 0 0 0.5em;
        list-style: none;
        border-left: 1px solid #eee;
    }

    li {
        padding: 0.2em 0;
    }
</style>
