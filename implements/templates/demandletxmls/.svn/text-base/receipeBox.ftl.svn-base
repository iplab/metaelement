<xml>
	<#if (product?exists)>
		<#list product.tab as tabs>
			<#if (tabs.name?exists && tabs.default?exists && tabs.content?exists)>
				<object name="${tabs.name}" default="${tabs.default}">
					<field>
						<![CDATA[${tabs.content}]]>
					</field>
				</object>
			</#if>
		</#list>
	</#if>
</xml>