"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MilkIcon as Cow, Wheat, Tractor, Droplets } from "lucide-react";

interface AddSectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSectionAdded: (section: any) => void;
}

export function AddSectionModal({
  open,
  onOpenChange,
  onSectionAdded,
}: AddSectionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    acreage: "",
    description: "",
    coordinates: { lat: "", lng: "" },
    livestock: {
      type: "",
      capacity: "",
    },
    crops: {
      type: "",
      plantedDate: "",
      expectedHarvest: "",
    },
    equipment: [] as string[],
  });

  const [equipmentInput, setEquipmentInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSection = {
      ...formData,
      acreage: Number.parseFloat(formData.acreage),
      coordinates: {
        lat: Number.parseFloat(formData.coordinates.lat),
        lng: Number.parseFloat(formData.coordinates.lng),
      },
      livestock:
        formData.type === "pasture"
          ? {
              ...formData.livestock,
              count: 0,
              capacity: Number.parseInt(formData.livestock.capacity),
            }
          : undefined,
      crops: formData.type === "cropland" ? formData.crops : undefined,
      status: "active",
      assignedWorkers: 0,
      activeTasks: 0,
      completedTasks: 0,
      lastInspection: new Date().toISOString().split("T")[0],
    };

    onSectionAdded(newSection);
    onOpenChange(false);

    // Reset form
    setFormData({
      name: "",
      type: "",
      acreage: "",
      description: "",
      coordinates: { lat: "", lng: "" },
      livestock: { type: "", capacity: "" },
      crops: { type: "", plantedDate: "", expectedHarvest: "" },
      equipment: [],
    });
    setEquipmentInput("");
  };

  const addEquipment = () => {
    if (equipmentInput.trim()) {
      setFormData({
        ...formData,
        equipment: [...formData.equipment, equipmentInput.trim()],
      });
      setEquipmentInput("");
    }
  };

  const removeEquipment = (index: number) => {
    setFormData({
      ...formData,
      equipment: formData.equipment.filter((_, i) => i !== index),
    });
  };

  const sectionTypes = [
    {
      value: "pasture",
      label: "Pasture",
      icon: Cow,
      description: "Grazing areas for livestock",
    },
    {
      value: "cropland",
      label: "Cropland",
      icon: Wheat,
      description: "Areas for crop production",
    },
    {
      value: "facility",
      label: "Facility",
      icon: Tractor,
      description: "Buildings and structures",
    },
    {
      value: "water",
      label: "Water Source",
      icon: Droplets,
      description: "Water reservoirs and sources",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Farm Section</DialogTitle>
          <DialogDescription>
            Create a new section to organize and manage your ranch operations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="type">Section Type</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Section Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., North Pasture A1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acreage">Acreage *</Label>
                  <Input
                    id="acreage"
                    type="number"
                    step="0.1"
                    value={formData.acreage}
                    onChange={(e) =>
                      setFormData({ ...formData, acreage: e.target.value })
                    }
                    placeholder="45.5"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of this section..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={formData.coordinates.lat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coordinates: {
                          ...formData.coordinates,
                          lat: e.target.value,
                        },
                      })
                    }
                    placeholder="40.7128"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={formData.coordinates.lng}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coordinates: {
                          ...formData.coordinates,
                          lng: e.target.value,
                        },
                      })
                    }
                    placeholder="-74.0060"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="type" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {sectionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card
                      key={type.value}
                      className={`cursor-pointer transition-colors ${
                        formData.type === type.value
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, type: type.value })
                      }
                    >
                      <CardHeader className="text-center">
                        <Icon className="h-8 w-8 mx-auto mb-2" />
                        <CardTitle className="text-lg">{type.label}</CardTitle>
                        <CardDescription>{type.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {formData.type === "pasture" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Livestock Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="livestock-type">Livestock Type</Label>
                        <Select
                          value={formData.livestock.type}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              livestock: { ...formData.livestock, type: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select livestock type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cattle">Cattle</SelectItem>
                            <SelectItem value="horses">Horses</SelectItem>
                            <SelectItem value="sheep">Sheep</SelectItem>
                            <SelectItem value="goats">Goats</SelectItem>
                            <SelectItem value="pigs">Pigs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={formData.livestock.capacity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              livestock: {
                                ...formData.livestock,
                                capacity: e.target.value,
                              },
                            })
                          }
                          placeholder="100"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {formData.type === "cropland" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Crop Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="crop-type">Crop Type</Label>
                      <Select
                        value={formData.crops.type}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            crops: { ...formData.crops, type: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corn">Corn</SelectItem>
                          <SelectItem value="soybeans">Soybeans</SelectItem>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="hay">Hay</SelectItem>
                          <SelectItem value="cotton">Cotton</SelectItem>
                          <SelectItem value="vegetables">Vegetables</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="planted-date">Planted Date</Label>
                        <Input
                          id="planted-date"
                          type="date"
                          value={formData.crops.plantedDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              crops: {
                                ...formData.crops,
                                plantedDate: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="harvest-date">Expected Harvest</Label>
                        <Input
                          id="harvest-date"
                          type="date"
                          value={formData.crops.expectedHarvest}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              crops: {
                                ...formData.crops,
                                expectedHarvest: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="equipment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Equipment & Infrastructure</CardTitle>
                  <CardDescription>
                    Add equipment and infrastructure present in this section
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={equipmentInput}
                      onChange={(e) => setEquipmentInput(e.target.value)}
                      placeholder="Enter equipment name..."
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addEquipment())
                      }
                    />
                    <Button type="button" onClick={addEquipment}>
                      Add
                    </Button>
                  </div>

                  {formData.equipment.length > 0 && (
                    <div className="space-y-2">
                      <Label>Added Equipment:</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.equipment.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 bg-secondary px-2 py-1 rounded"
                          >
                            <span className="text-sm">{item}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                              onClick={() => removeEquipment(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.name || !formData.type || !formData.acreage}
            >
              Add Section
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
