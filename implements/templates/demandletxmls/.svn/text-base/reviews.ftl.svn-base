<xml>
	<#if (product?exists)>
		<#if (product.rating?exists)>
			<rating>${product.rating}</rating>
		</#if>
		<#if (product.ratingcount?exists)>
			<ratingcount>${product.ratingcount}</ratingcount>
		</#if>
		<#list product.review as reviews>
			<reviews>
				<#if (reviews.title?exists)>
					<title>${reviews.title}</title>
				</#if>
				<#if (reviews.review_text?exists)>
					<review_text>${reviews.review_text}</review_text>
				</#if>
				<#if (reviews.create_date?exists)>
					<create_date>${reviews.create_date}</create_date>
				</#if>
				<#if (reviews.modify_date?exists)>
					<modify_date>${reviews.modify_date}</modify_date>
				</#if>
				<#if (reviews.page_name?exists)>
					<penname>${reviews.penname}</penname>
				</#if>
			</reviews>
		</#list>
	</#if>	
</xml>
