<xml>
	<#if (product?exists)>
		<#list product.alsolike as alsolikes>
			<row>
				<#if (alsolikes.title?exists)>
					<name>${alsolikes.title}</name>
				</#if>
				<#if (alsolikes.page_name?exists)>
					<page_name>${alsolikes.page_name}</page_name>
				</#if>
				<#if (alsolikes.src_image?exists)>
					<image>${alsolikes.src_image}</image>
				</#if>
				<#if (alsolikes.our_price_us?exists)>
					<our_price_us>${alsolikes.our_price_us}</our_price_us>
				</#if>
				<#if (alsolikes.our_price_canada?exists)>
					<our_price_canada>${alsolikes.our_price_canada}</our_price_canada>
				</#if>
				<#if (alsolikes.sale_price_us?exists)>
					<sale_price_us>${alsolikes.sale_price_us}</sale_price_us>
				</#if>
				<#if (alsolikes.sale_price_canada?exists)>
					<sale_price_canada>${alsolikes.sale_price_canada}</sale_price_canada>
				</#if>
				<#if (alsolikes.product_canada?exists)>
					<product_canada>${alsolikes.product_canada}</product_canada>
				</#if>
			</row>
		</#list> 
	</#if>	
</xml>
