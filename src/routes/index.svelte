
<script lang='ts'>
    import { SisenseContext } from '../scripts/SisenseContext';
    import { jaql } from '../scripts/JAQLHelpers'
    import MultiSelect from 'svelte-multiselect'

    let selected

    const sisense = new SisenseContext(<sisense url>)


    function buildJaql(items: string[]) {
        const fList = items.reverse();
        const j = jaql('Healthcare Model - New', (dimension, formula) => {

            const qItems = fList.map((item) => {
                if(item === 'visits.total_charges' || item === 'visits.total_cost') {
                    return dimension(item).title(item.split('.')[1]).agg('sum')
                } else {
                    return dimension(item).title(item.split('.')[1])
                }
            })

            return qItems
        })

        return j
    }
    

    async function getFieldsList() {
        await sisense.login(<username>,<password>)

        const fields = await sisense.getFields('Healthcare Model - New')

        const fieldsCleaned = fields.map(x => { 
            return x.replace('[','').replace(']','')
        })

        return fieldsCleaned

    }

    let tableData

    async function getData() {

        await sisense.login(<username>,<password>)

        const jaql = buildJaql(selected)

        const res = await sisense.query(jaql)

        tableData = res

        return res

    }

    const metrics = [
        {jaql:'visits.visit_id', display:'Visits'},
        {jaql:'visits.total_charges', display: 'Charges'},
        {jaql:'visits.total_cost', display: 'Cost'}
    ]

    const metricsList = metrics.map(x => x.display)

</script>

<div class="container">
    <div class="flex-cont">
        {#await getFieldsList()}
            <div>Loading...</div>
        {:then fields}
            <MultiSelect bind:selected options={fields} 
                --sms-token-bg="#fdb407" 
                --sms-selected-color="#fdb407"
                --sms-li-selected-bg="white"
                />
        {/await}
        <div class="buttons">
            <button on:click={ getData }>Submit</button>
        </div>

        {#if tableData}
            <table>
                <thead>
                    <tr>
                        {#each tableData.headers as item}
                            <th>{ item }</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each tableData.values as item}
                        <tr>
                            {#each item as sub}
                                <td>{ sub }</td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
</div>

<style>

table {
    border-collapse: collapse;
}

th, td {
    border-top: 1px solid darkgrey;
    padding: 10px 0px 10px 0px;
}

:global(.options) {
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2), -2px 2px 0 rgba(0,0,0,0.2);
}

:global(li:hover) {
    background-color: darkgrey;
}

.container {
    margin: auto;
    max-width: 750px;
}

button {
    width: 10rem;
    text-align: center;
    padding: 5px 10px 5px 10px;
    margin-bottom: 2rem;
}

.flex-cont {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.buttons {
    display: flex;
    justify-content: center;
}



</style>
