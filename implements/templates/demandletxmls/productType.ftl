<xml>
	<#if (product?exists)>
		<#list product.types as type>
			<row>
				<#if (type.product_type_id?exists)>
					<product_type_id>${type.product_type_id}</product_type_id>
				</#if>
				<#if (type.name?exists)>
					<name>${type.name}</name>
				</#if>
			</row>
		</#list>	
	</#if>	
</xml>
