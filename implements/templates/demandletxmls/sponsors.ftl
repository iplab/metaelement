<xml>
<#if (sponsors?exists)>
	<#list sponsors.row as sponsors>
		<row>
			<#if (sponsors.sponsor_id?exists)>
				<sponsor_id>${sponsors.sponsor_id}</sponsor_id>
			</#if>
			<#if (sponsors.name?exists)>
				<name>${sponsors.name}</name>
			</#if>
			<#if (sponsors.description?exists)>
				<description>${sponsors.description}</description>
			</#if>
			<#if (sponsors.image_url?exists)>
				<image_url>${sponsors.image_url}</image_url>
			</#if>
		</row>
	</#list>
</#if>
</xml>