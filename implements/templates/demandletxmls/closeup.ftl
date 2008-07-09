<xml>
	<closeup>
		<#list product.closeup as closeups> 
			<row>
				<#if (closeups.name?exists)>
					<name>${closeups.name}</name>
				</#if>
				<#if (closeups.image?exists)>
					<image>${closeups.image}</image>
				</#if>
				<#if (closeups.description?exists)>
					<description>${closeups.description}</description>
				</#if>
				<#if (closeups.type?exists)>
					<type>${closeups.type}</type>
				</#if>
				<#if (closeups.type_id?exists)>
					<type_id>${closeups.type_id}</type_id>
				</#if>
				<#if (closeups.page_name?exists)>
					<page_name>${closeups.page_name}</page_name>
				</#if>
			</row>
		</#list>
	</closeup>
</xml>