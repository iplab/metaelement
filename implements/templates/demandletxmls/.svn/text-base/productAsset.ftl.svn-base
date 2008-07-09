<xml> 
	<#if (product?exists)>
		<object name="photo">
			<#list product.photo as photos>
				<row>
					<#if (photos.photo_url?exists)>
						<url>${photos.photo_url}</url>
					</#if>
					<#if (photos.photo_description?exists)>
						<description>${photos.photo_description}</description>
					</#if>
				</row>
			</#list>
		</object>
		<object name="video">
			<#list product.video as videos>
				<row>
					<#if (videos.video_url?exists)>
						<url>${videos.video_url}</url>
					</#if>
					<#if (videos.video_description?exists)>
						<description>${videos.video_description}</description>
					</#if>
				</row>
			</#list>		
		</object>
	</#if>
</xml>