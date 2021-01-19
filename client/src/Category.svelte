<script>
    import {getCategoryChildren, addCategory, deleteCategory} from "sql-arbitrary-category-system-fetch-utils";

    export let expanded = false;
    let modalOpen = false;
    export let set_id;
    export let id;
    export let name;

    let categoryName;

    let children = [];
    let hasChildren;
    $: {
        hasChildren = children.length > 0;
    }

    $: {
        (async () => {
            children = await getCategoryChildren(id);
        })()
    }

    function toggle() {
        expanded = !expanded;
    }

    async function addCategoryHandler() {
        await addCategory(categoryName, set_id, id);
        categoryName = '';
        modalOpen = false;
        children = await getCategoryChildren(id);
    }

    async function deleteCategoryHandler(catId) {
        await deleteCategory(catId);
        children = await getCategoryChildren(id);
    }
</script>

<span class="folder" class:hasChildren class:expanded on:click={toggle}>{name}</span>
<span on:click={() => modalOpen = true} class="add">+</span>

{#if modalOpen}
    <div class="modal" on:click|self={() => modalOpen = false}>
        <div class="card">
            <label>
                Category Name
                <input bind:value={categoryName} type="text">
                <button on:click={addCategoryHandler}>Add</button>
            </label>
        </div>
    </div>
{/if}

{#if expanded}
    {#each children as child}
        <ul>
            <li>
                <span on:click={() => deleteCategoryHandler(child.id)} class="delete">✖</span>
                <svelte:self {...child}/>
            </li>
        </ul>
    {/each}
{/if}


<style>
    .card {
        background-color: white;
    }

    .modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .8);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .folder {
        padding: 0 0 0 1.5em;
        font-weight: bold;
        font-size: 20px;
    }

    .hasChildren {
        background: url(/folder.svg) 0 0.1em no-repeat;
        background-position-y: 0;
    }

    .add {
        font-weight: 900;
        position: relative;
        right: 2px;
    }

    .hasChildren.expanded {
        background-image: url(/folder-open.svg);
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
