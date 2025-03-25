'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Trash2, 
  Info, 
  HelpCircle,
  FileImage,
  Image,
  X,
  Copy,
  DollarSign,
  Percent
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { VariationPanel } from '@/types/print-options';

interface VariationPanelsProps {
  variations: VariationPanel[];
  onUpdate: (variations: VariationPanel[]) => void;
}

const VariationPanels: React.FC<VariationPanelsProps> = ({ 
  variations, 
  onUpdate 
}) => {
  const [expandedPanels, setExpandedPanels] = useState<string[]>([]);
  
  // Initialize with default variations if none exist
  useEffect(() => {
    if (variations.length === 0) {
      const defaultVariations: VariationPanel[] = [
        {
          id: crypto.randomUUID(),
          name: 'Quantity',
          type: 'quantity',
          enabled: true,
          discountType: 'fixed',
          attributes: []
        },
        {
          id: crypto.randomUUID(),
          name: 'Paper Size or Format',
          type: 'paper-size',
          enabled: true,
          priceType: 'fixed',
          dependOnQuantity: false,
          attributes: []
        },
        {
          id: crypto.randomUUID(),
          name: 'Paper Type',
          type: 'paper-type',
          enabled: true,
          priceType: 'fixed',
          dependOnQuantity: false,
          attributes: []
        },
        {
          id: crypto.randomUUID(),
          name: 'Finishing',
          type: 'finishing',
          enabled: true,
          priceType: 'fixed',
          dependOnQuantity: false,
          attributes: []
        }
      ];
      
      onUpdate(defaultVariations);
      
      // Expand the Quantity panel by default
      setExpandedPanels([defaultVariations[0].id]);
    }
  }, [variations.length, onUpdate]);
  
  const togglePanel = (panelId: string) => {
    setExpandedPanels(prev => 
      prev.includes(panelId) 
        ? prev.filter(id => id !== panelId)
        : [...prev, panelId]
    );
  };
  
  const handlePanelChange = (index: number, updatedPanel: VariationPanel) => {
    const updatedVariations = [...variations];
    updatedVariations[index] = updatedPanel;
    onUpdate(updatedVariations);
  };
  
  const handleEnableToggle = (index: number, enabled: boolean) => {
    const updatedVariations = [...variations];
    updatedVariations[index] = {
      ...updatedVariations[index],
      enabled
    };
    onUpdate(updatedVariations);
  };
  
  const handleAddAttribute = (index: number) => {
    const updatedVariations = [...variations];
    const newAttribute = {
      id: crypto.randomUUID(),
      name: '',
      isDefault: false,
      description: '',
      price: 0
    };
    
    updatedVariations[index].attributes = [
      ...updatedVariations[index].attributes,
      newAttribute
    ];
    
    onUpdate(updatedVariations);
  };
  
  const handleAttributeChange = (panelIndex: number, attrIndex: number, field: string, value: any) => {
    const updatedVariations = [...variations];
    
    if (field === 'isDefault' && value === true) {
      // Unset other defaults
      updatedVariations[panelIndex].attributes.forEach((attr, i) => {
        if (i !== attrIndex) {
          attr.isDefault = false;
        }
      });
    }
    
    updatedVariations[panelIndex].attributes[attrIndex] = {
      ...updatedVariations[panelIndex].attributes[attrIndex],
      [field]: value
    };
    
    onUpdate(updatedVariations);
  };
  
  const handleRemoveAttribute = (panelIndex: number, attrIndex: number) => {
    const updatedVariations = [...variations];
    updatedVariations[panelIndex].attributes.splice(attrIndex, 1);
    onUpdate(updatedVariations);
  };
  
  const renderQuantityPanel = (panel: VariationPanel, index: number) => {
    return (
      <div className="variation-panel__content">
        <div className="grid grid-cols-1 gap-6">
          <div className="variation-panel__field">
            <label className="block text-sm font-medium text-[#49617E] mb-2">
              Discount Type
            </label>
            <select
              value={panel.discountType}
              onChange={(e) => handlePanelChange(index, { ...panel, discountType: e.target.value as 'fixed' | 'percentage' })}
              className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
            >
              <option value="fixed">Fixed Price</option>
              <option value="percentage">Percentage of Original Price</option>
            </select>
          </div>
          
          <div className="variation-panel__quantity-breaks">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-semibold text-[#49617E]">Quantity Breaks</h4>
              <Button 
                type="button"
                size="sm" 
                variant="outline"
                leftIcon={<Plus size={14} />}
                onClick={() => handleAddAttribute(index)}
              >
                Add Quantity Break
              </Button>
            </div>
            
            {panel.attributes.length === 0 ? (
              <div className="bg-[#F8F9FA] border border-dashed border-[#E4E7EB] rounded-md p-4 text-center">
                <p className="text-sm text-[#6F8591]">No quantity breaks defined yet. Add your first quantity break.</p>
              </div>
            ) : (
              <div className="border border-[#E4E7EB] rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#F8F9FA] border-b border-[#E4E7EB]">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#49617E]">Quantity Break</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#49617E]">
                        {panel.discountType === 'fixed' ? 'Fixed Price' : 'Discount %'}
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#49617E]">Default</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-[#49617E]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {panel.attributes.map((attr, attrIndex) => (
                      <tr key={attr.id} className="border-b border-[#E4E7EB]">
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={attr.name || ''}
                            onChange={(e) => handleAttributeChange(index, attrIndex, 'name', e.target.value)}
                            placeholder="e.g., 100"
                            className="w-full px-3 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <div className="relative">
                            {panel.discountType === 'fixed' ? (
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                                  <DollarSign size={14} className="text-[#6F8591]" />
                                </span>
                                <input
                                  type="number"
                                  value={attr.price || 0}
                                  onChange={(e) => handleAttributeChange(index, attrIndex, 'price', parseFloat(e.target.value))}
                                  placeholder="0.00"
                                  className="w-full pl-8 pr-3 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                                  step="0.01"
                                  min="0"
                                />
                              </div>
                            ) : (
                              <div className="relative">
                                <input
                                  type="number"
                                  value={attr.price || 0}
                                  onChange={(e) => handleAttributeChange(index, attrIndex, 'price', parseFloat(e.target.value))}
                                  placeholder="0"
                                  className="w-full pl-3 pr-8 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                                  step="0.1"
                                  min="0"
                                  max="100"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <Percent size={14} className="text-[#6F8591]" />
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={attr.isDefault}
                            onChange={(e) => handleAttributeChange(index, attrIndex, 'isDefault', e.target.checked)}
                            className="rounded border-[#E4E7EB]"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveAttribute(index, attrIndex)}
                            className="text-[#49617E] hover:text-[#F85464] transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderAttributePanel = (panel: VariationPanel, index: number) => {
    return (
      <div className="variation-panel__content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="variation-panel__field">
            <label className="block text-sm font-medium text-[#49617E] mb-2">
              Price Type
            </label>
            <select
              value={panel.priceType}
              onChange={(e) => handlePanelChange(index, { ...panel, priceType: e.target.value as 'fixed' | 'percentage' })}
              className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
            >
              <option value="fixed">Fixed Amount</option>
              <option value="percentage">Percentage of Original Price</option>
            </select>
          </div>
          
          <div className="variation-panel__field">
            <label className="block text-sm font-medium text-[#49617E] mb-2">
              Depend on Quantity Breaks
            </label>
            <select
              value={panel.dependOnQuantity ? 'yes' : 'no'}
              onChange={(e) => handlePanelChange(index, { ...panel, dependOnQuantity: e.target.value === 'yes' })}
              className="w-full px-4 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <p className="text-xs text-[#6F8591] mt-1">
              If yes, each attribute will have a price input for each quantity level.
            </p>
          </div>
        </div>
        
        <div className="variation-panel__attributes">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-[#49617E]">Attributes</h4>
            <Button 
              type="button"
              size="sm" 
              variant="outline"
              leftIcon={<Plus size={14} />}
              onClick={() => handleAddAttribute(index)}
            >
              Add Attribute
            </Button>
          </div>
          
          {panel.attributes.length === 0 ? (
            <div className="bg-[#F8F9FA] border border-dashed border-[#E4E7EB] rounded-md p-4 text-center">
              <p className="text-sm text-[#6F8591]">No attributes defined yet. Add your first attribute.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {panel.attributes.map((attr, attrIndex) => (
                <div 
                  key={attr.id} 
                  className="variation-panel__attribute bg-[#F8F9FA] border border-[#E4E7EB] rounded-md p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="text-sm font-medium text-[#2B4F60]">
                      Attribute #{attrIndex + 1}
                    </h5>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(index, attrIndex)}
                      className="text-[#49617E] hover:text-[#F85464] transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="variation-panel__field">
                      <label className="block text-xs font-medium text-[#49617E] mb-1">
                        Attribute Name <span className="text-[#F85464]">*</span>
                      </label>
                      <input
                        type="text"
                        value={attr.name || ''}
                        onChange={(e) => handleAttributeChange(index, attrIndex, 'name', e.target.value)}
                        placeholder={`e.g., ${panel.type === 'paper-size' ? 'A4' : panel.type === 'paper-type' ? 'Glossy' : 'Lamination'}`}
                        className="w-full px-3 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                      />
                    </div>
                    
                    <div className="variation-panel__field">
                      <label className="block text-xs font-medium text-[#49617E] mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={attr.description || ''}
                        onChange={(e) => handleAttributeChange(index, attrIndex, 'description', e.target.value)}
                        placeholder="Optional description"
                        className="w-full px-3 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                      />
                    </div>
                    
                    <div className="variation-panel__field">
                      <label className="block text-xs font-medium text-[#49617E] mb-1">
                        Default Option
                      </label>
                      <div className="flex items-center mt-1">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={attr.isDefault}
                            onChange={(e) => handleAttributeChange(index, attrIndex, 'isDefault', e.target.checked)}
                            className="rounded border-[#E4E7EB]"
                          />
                          <span className="ml-2 text-xs text-[#49617E]">
                            Set as default
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="variation-panel__field">
                      <label className="block text-xs font-medium text-[#49617E] mb-1">
                        Swatch Type
                      </label>
                      <select
                        value={attr.swatchType || 'image'}
                        onChange={(e) => handleAttributeChange(index, attrIndex, 'swatchType', e.target.value)}
                        className="w-full px-3 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                      >
                        <option value="image">Small Image for Variation Panel</option>
                        <option value="product-image">Product Image</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-[#49617E] mb-1">
                      Upload Swatch Image
                    </label>
                    <div className="border border-dashed border-[#E4E7EB] rounded-md p-4 flex items-center justify-center bg-white">
                      <div className="text-center">
                        <FileImage className="mx-auto text-[#6F8591]" size={24} />
                        <p className="text-xs text-[#49617E] mt-2">Drag & drop or click to select an image</p>
                        <p className="text-xs text-[#6F8591] mt-1">PNG, JPG or SVG, max 1MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-[#49617E] mb-2">
                      Price Information
                    </label>
                    
                    {panel.dependOnQuantity ? (
                      <div className="bg-white border border-[#E4E7EB] rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-[#F8F9FA] border-b border-[#E4E7EB]">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-[#49617E]">Quantity</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-[#49617E]">
                                {panel.priceType === 'fixed' ? 'Additional Price' : 'Price Percentage'}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {variations.find(v => v.type === 'quantity')?.attributes.map((quantityAttr) => (
                              <tr key={quantityAttr.id} className="border-b border-[#E4E7EB]">
                                <td className="px-3 py-2 text-xs text-[#49617E]">
                                  {quantityAttr.name || 'Undefined quantity'}
                                </td>
                                <td className="px-3 py-2">
                                  <div className="relative">
                                    {panel.priceType === 'fixed' ? (
                                      <div className="relative">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2">
                                          <DollarSign size={12} className="text-[#6F8591]" />
                                        </span>
                                        <input
                                          type="number"
                                          value={attr.prices?.[quantityAttr.id] || 0}
                                          onChange={(e) => {
                                            const prices = { ...(attr.prices || {}) };
                                            prices[quantityAttr.id] = parseFloat(e.target.value);
                                            handleAttributeChange(index, attrIndex, 'prices', prices);
                                          }}
                                          placeholder="0.00"
                                          className="w-full pl-7 pr-2 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-xs"
                                          step="0.01"
                                          min="0"
                                        />
                                      </div>
                                    ) : (
                                      <div className="relative">
                                        <input
                                          type="number"
                                          value={attr.prices?.[quantityAttr.id] || 0}
                                          onChange={(e) => {
                                            const prices = { ...(attr.prices || {}) };
                                            prices[quantityAttr.id] = parseFloat(e.target.value);
                                            handleAttributeChange(index, attrIndex, 'prices', prices);
                                          }}
                                          placeholder="0"
                                          className="w-full pl-2 pr-7 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-xs"
                                          step="0.1"
                                          min="0"
                                          max="100"
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2">
                                          <Percent size={12} className="text-[#6F8591]" />
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            
                            {variations.find(v => v.type === 'quantity')?.attributes.length === 0 && (
                              <tr>
                                <td colSpan={2} className="px-3 py-3 text-center text-xs text-[#6F8591]">
                                  No quantity breaks defined. Please add quantity breaks first.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="relative">
                        {panel.priceType === 'fixed' ? (
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">
                              <DollarSign size={14} className="text-[#6F8591]" />
                            </span>
                            <input
                              type="number"
                              value={attr.price || 0}
                              onChange={(e) => handleAttributeChange(index, attrIndex, 'price', parseFloat(e.target.value))}
                              placeholder="0.00"
                              className="w-full pl-8 pr-3 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                              step="0.01"
                              min="0"
                            />
                          </div>
                        ) : (
                          <div className="relative">
                            <input
                              type="number"
                              value={attr.price || 0}
                              onChange={(e) => handleAttributeChange(index, attrIndex, 'price', parseFloat(e.target.value))}
                              placeholder="0"
                              className="w-full pl-3 pr-8 py-2 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9]"
                              step="0.1"
                              min="0"
                              max="100"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Percent size={14} className="text-[#6F8591]" />
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {panel.type === 'paper-size' && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-medium text-[#49617E]">
                          Online Design Settings
                        </label>
                        <button
                          type="button"
                          className="text-xs text-[#007BF9] hover:underline flex items-center"
                        >
                          <HelpCircle size={12} className="mr-1" />
                          What is this?
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="variation-panel__field">
                          <label className="block text-xs text-[#49617E] mb-1">
                            Product Width (mm)
                          </label>
                          <input
                            type="number"
                            value={attr.designSettings?.productWidth || ''}
                            onChange={(e) => {
                              const designSettings = { ...(attr.designSettings || {}) };
                              designSettings.productWidth = parseFloat(e.target.value);
                              handleAttributeChange(index, attrIndex, 'designSettings', designSettings);
                            }}
                            placeholder="0"
                            className="w-full px-3 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-xs"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        
                        <div className="variation-panel__field">
                          <label className="block text-xs text-[#49617E] mb-1">
                            Product Height (mm)
                          </label>
                          <input
                            type="number"
                            value={attr.designSettings?.productHeight || ''}
                            onChange={(e) => {
                              const designSettings = { ...(attr.designSettings || {}) };
                              designSettings.productHeight = parseFloat(e.target.value);
                              handleAttributeChange(index, attrIndex, 'designSettings', designSettings);
                            }}
                            placeholder="0"
                            className="w-full px-3 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-xs"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        
                        <div className="variation-panel__field">
                          <label className="block text-xs text-[#49617E] mb-1">
                            Design Width (mm)
                          </label>
                          <input
                            type="number"
                            value={attr.designSettings?.designWidth || ''}
                            onChange={(e) => {
                              const designSettings = { ...(attr.designSettings || {}) };
                              designSettings.designWidth = parseFloat(e.target.value);
                              handleAttributeChange(index, attrIndex, 'designSettings', designSettings);
                            }}
                            placeholder="0"
                            className="w-full px-3 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-xs"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        
                        <div className="variation-panel__field">
                          <label className="block text-xs text-[#49617E] mb-1">
                            Design Height (mm)
                          </label>
                          <input
                            type="number"
                            value={attr.designSettings?.designHeight || ''}
                            onChange={(e) => {
                              const designSettings = { ...(attr.designSettings || {}) };
                              designSettings.designHeight = parseFloat(e.target.value);
                              handleAttributeChange(index, attrIndex, 'designSettings', designSettings);
                            }}
                            placeholder="0"
                            className="w-full px-3 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-xs"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        
                        <div className="variation-panel__field">
                          <label className="block text-xs text-[#49617E] mb-1">
                            Design Top (mm)
                          </label>
                          <input
                            type="number"
                            value={attr.designSettings?.designTop || ''}
                            onChange={(e) => {
                              const designSettings = { ...(attr.designSettings || {}) };
                              designSettings.designTop = parseFloat(e.target.value);
                              handleAttributeChange(index, attrIndex, 'designSettings', designSettings);
                            }}
                            placeholder="0"
                            className="w-full px-3 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-xs"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        
                        <div className="variation-panel__field">
                          <label className="block text-xs text-[#49617E] mb-1">
                            Design Left (mm)
                          </label>
                          <input
                            type="number"
                            value={attr.designSettings?.designLeft || ''}
                            onChange={(e) => {
                              const designSettings = { ...(attr.designSettings || {}) };
                              designSettings.designLeft = parseFloat(e.target.value);
                              handleAttributeChange(index, attrIndex, 'designSettings', designSettings);
                            }}
                            placeholder="0"
                            className="w-full px-3 py-1 border border-[#E4E7EB] rounded-md focus:outline-none focus:ring-1 focus:ring-[#007BF9] focus:border-[#007BF9] text-xs"
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="variation-panels">
      <h2 className="text-[#2B4F60] text-lg font-semibold mb-4">Product Variation Panels</h2>
      
      {variations.map((panel, index) => (
        <div 
          key={panel.id}
          className="variation-panel bg-white rounded-md border border-[#E4E7EB] mb-4 overflow-hidden"
        >
          <div className="variation-panel__header bg-[#F8F9FA] border-b border-[#E4E7EB] px-6 py-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => togglePanel(panel.id)}
              className="variation-panel__toggle flex items-center"
            >
              {expandedPanels.includes(panel.id) ? (
                <ChevronDown size={20} className="text-[#49617E] mr-2" />
              ) : (
                <ChevronRight size={20} className="text-[#49617E] mr-2" />
              )}
              <h3 className="text-[#2B4F60] font-semibold">
                Variation Panel For: {panel.name}
              </h3>
            </button>
            
            <div className="variation-panel__controls flex items-center">
              <label className="inline-flex items-center cursor-pointer mr-4">
                <input
                  type="checkbox"
                  checked={panel.enabled}
                  onChange={(e) => handleEnableToggle(index, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-10 h-5 bg-[#E0E0E0] peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[#007BF9] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#30BF89]"></div>
                <span className="ml-2 text-xs text-[#49617E]">
                  {panel.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          </div>
          
          {expandedPanels.includes(panel.id) && (
            <div className="variation-panel__body p-6">
              {panel.type === 'quantity' ? (
                renderQuantityPanel(panel, index)
              ) : (
                renderAttributePanel(panel, index)
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default VariationPanels;