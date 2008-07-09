<xml>
	<#if (product?exists)>
		<#list product.genres as genre>
			<row>
				<#if (genre.category_id?exists)>
					<sub_genre_id>${genre.category_id}</sub_genre_id>
				</#if>
				<#if (genre.name?exists)>
					<name>${genre.name}</name>
				</#if>
			</row>
		</#list>	
	</#if>	
</xml>
