<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" >
<xsl:output method="html" />
<!-- doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" 
    doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/> -->
     
	<xsl:template match="/xml">
			<xsl:apply-templates select="row" />
	</xsl:template>

	<xsl:template match="row">
		<xsl:apply-templates select="property" />
	</xsl:template>

	<xsl:template match="property">

		<xsl:variable name="id">
			<xsl:value-of select="." />
		</xsl:variable>

		<xsl:choose>
			<xsl:when test="@name='category.category_id'">
				<node text="All Sites">
					<node text="Event Calendar" on="click : function (){{ events.load('{$id}'); }}"/>
					<node text="Assets" on="click : function (){{ assetObj.grid('{$id}','Home'); }}"/>
					<node text="Polls" on="click : function (){{ pollObj.grid('{$id}','universe'); }}" />
					<node text="Registered Users" on="click : function (){{ manageCDAUsers.loadCenter(); }}" />
					<node text="CMA Administrators" on="click : function (){{ manageAdmins.loadCenter(); }}" />
					<node text="Jive" on="click : function (){{  }}" />
				</node>
			</xsl:when>
			<xsl:when test="@name='site_category_id'">
					<ajaxNode text="This Site" id="category_id_{$id}" iconCls="folder" leaf="false" />
			</xsl:when>
		</xsl:choose>

	</xsl:template>

</xsl:stylesheet>