<script>
    import {
        getTopLevelCategories,
        addCategory,
        deleteCategory, getCategoryChildren
    } from "sql-arbitrary-category-system-fetch-utils";
    import Category from "./Category.svelte";
    import Icon from 'fa-svelte';
    import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
    import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
    import {faFolderOpen} from '@fortawesome/free-solid-svg-icons/faFolderOpen';
    import {faFolder} from '@fortawesome/free-solid-svg-icons/faFolder';

    export let expanded = false;
    let modalOpen = false;
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
            children = await getTopLevelCategories(id);
        })()
    }

    function toggle() {
        expanded = !expanded;
    }

    async function addCategoryHandler() {
        await addCategory(categoryName, id);
        categoryName = '';
        modalOpen = false;
        children = await getTopLevelCategories(id);
    }

    async function deleteCategoryHandler(catId) {
        await deleteCategory(catId);
        children = await getCategoryChildren(id);
    }
</script>

<span class="pl-1.5 font-bold text-xl" on:click={toggle}>
    {#if hasChildren}
       {#if expanded}
           <Icon icon={faFolderOpen}></Icon>
       {:else}
           <Icon icon={faFolder}></Icon>
       {/if}
    {/if}
    {name}
</span>
<span on:click={() => modalOpen = true} class="relative text-sm">
    <Icon class="mb-1.5" icon={faPlus}></Icon>
</span>

{#if modalOpen}
    <div class="bg-black bg-opacity-80 absolute top-0 left-0 w-full h-full flex justify-center items-center"
         on:click|self={() => modalOpen = false}>
        <div class="bg-white">
            <label class="flex flex-col p-3 items-center">
                <span class="m-1">Category Name</span>
                <input class="m-1" bind:value={categoryName} type="text">
                <button class="m-1 w-3/4 bg-gray-200" on:click={addCategoryHandler}>Add</button>
            </label>
        </div>
    </div>
{/if}

{#if expanded}
    {#each children as child}
        <ul class="list-none ml-2 pt-1 pl-2 border-l border-gray-100">
            <li class="pt-1 pb-1">
                <span on:click={() => deleteCategoryHandler(child.id)} class="delete">
                    <Icon icon={faTimes}></Icon>
                </span>
                <Category {...child}/>
            </li>
        </ul>
    {/each}
{/if}

