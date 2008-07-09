<xml>
<#if (venue?exists)>
	<#list venue.row as venues>
		<row>
			<#if (venues.venue_id?exists)>
				<venue_id>${venues.venue_id}</venue_id>
			</#if>
			<#if (venues.name?exists)>
				<name>${venues.name}</name>
			</#if>
			<#if (venues.description?exists)>
				<description>${venues.description}</description>
			</#if>
		</row>
	</#list>
</#if>
</xml>