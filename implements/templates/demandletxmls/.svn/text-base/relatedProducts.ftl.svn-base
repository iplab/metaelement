<xml>
	<#if (product?exists)>
		<#list product.relatedproducts as relatedproducts>
			<row>
				<#if (relatedproducts.title?exists)>
					<name>${relatedproducts.title}</name>
				</#if>
				<#if (relatedproducts.page_name?exists)>
					<page_name>${relatedproducts.page_name}</page_name>
				</#if>
				<#if (relatedproducts.product_canada?exists)>
					<product_canada>${relatedproducts.product_canada}</product_canada>
				</#if>
			</row>
		</#list> 
	</#if>	
</xml>
