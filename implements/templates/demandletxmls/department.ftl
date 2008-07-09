<xml>
	<#if (product?exists)>
		<#list product.dept as depts>
			<row>
				<#if (depts.category_id?exists)>
					<cat_id>${depts.category_id}</cat_id>
				</#if>
				<#if (depts.name?exists)>
					<name>${depts.name}</name>
				</#if>
			</row>
		</#list>
	</#if>	
</xml>
